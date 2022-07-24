import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ContentType } from '@prisma/client';
import { AxiosResponse } from 'axios';
import { lastValueFrom, map, Observable } from 'rxjs';
import FormData from 'form-data';

import { PrismaService } from 'modules/prisma/prisma.service';

export interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
}

@Injectable()
export class ImageService {
  constructor(private prisma: PrismaService, private httpService: HttpService) {}

  async save(user: any, _: any, file: Express.Multer.File) {
    const type = file.originalname.split('.')[0].split('-')[0] as ContentType;

    let response: any;
    try {
      response = await this.saveImageData(file);
    } catch (e) {
      throw new HttpException(
        'Image processing error: ' + e.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (response) {
      const { image, thumb } = response as TImageHostResponseData;
      const { extension, filename, mime, name, url } = image;

      this.prisma.savedImage.create({
        data: {
          userId: user.id,
          extension,
          filename,
          mime,
          name,
          type,
          url,
          thumbUrl: thumb.url,
        },
      });
    }

    return { data: response, message: 'Image saved' };
  }

  async getAll(userId: string) {
    return this.prisma.savedImage.findMany({ where: { userId } });
  }

  private async saveImageData(
    multerFile: Express.Multer.File,
  ): Promise<Observable<AxiosResponse<any, any>>> {
    const apiKey = process.env.IMG_HOST_API_KEY;
    const formData = new FormData({ writable: true, readable: true });

    formData.append('key', apiKey);
    formData.append('name', multerFile.originalname.split('.')[0]);
    formData.append('image', multerFile.buffer, multerFile.originalname.split('.')[0]);

    try {
      const response = await lastValueFrom(
        this.httpService
          .post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData, {
            headers: {
              'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
            },
          })
          .pipe(map(res => res.data)),
      );

      return response.data;
    } catch (e) {
      throw new HttpException(
        'hosting error - ' + e.message + ' - ' + e.response?.data?.error?.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

type TImageHostResponseData = {
  id: string; // 'qmZN216';
  title: string; // 'logo-front';
  url_viewer: string; // 'https://ibb.co/qmZN216';
  url: string; // 'https://i.ibb.co/VMKgkB6/logo-front.png';
  display_url: string; // 'https://i.ibb.co/VMKgkB6/logo-front.png';
  width: string; // '190';
  height: string; // '190';
  size: number; // 27222;
  time: string; // '1656441947';
  expiration: string; // '0';
  image: {
    filename: string; // 'logo-front.png';
    name: string; // 'logo-front';
    mime: string; // 'image/png';
    extension: string; // 'png';
    url: string; // 'https://i.ibb.co/VMKgkB6/logo-front.png';
  };
  thumb: {
    filename: string; // 'logo-front.png';
    name: string; // 'logo-front';
    mime: string; // 'image/png';
    extension: string; // 'png';
    url: string; // 'https://i.ibb.co/qmZN216/logo-front.png';
  };
  delete_url: string; // 'https://ibb.co/qmZN216/d23ddd7717398647eded9ac5421f19af';
};
