import { ApiProperty } from '@nestjs/swagger';
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { MLContentType, Multilink } from '../multilink.model';
import { IMLVideoCreationAttributes } from '../types/creation-attr';

@Table({ tableName: 'mlvideos' })
export class MLVideo extends Model<MLVideo, IMLVideoCreationAttributes> {
  @ApiProperty({ example: '69', description: 'Unique MLVideo ID' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: '5', description: 'ML content order value' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  order: number;

  @Column({ type: DataType.ARRAY(DataType.FLOAT) })
  padding: number[];

  @Column({ type: DataType.ARRAY(DataType.FLOAT) })
  margin: number[];

  @ApiProperty({ example: '#ff0', description: 'ML block CSS background' })
  @Column({ type: DataType.STRING })
  background: string;

  @ApiProperty({ example: 'video', description: 'ML content type' })
  @Column({ type: DataType.STRING, allowNull: false })
  type: MLContentType.VIDEO;

  // ================================================================================

  @ApiProperty({ example: 'https://www.youtube.com/embed/hYu0d-4SX_Y', description: 'video URL' })
  @Column({ type: DataType.STRING, allowNull: false })
  url: string;

  @Column({ type: DataType.FLOAT })
  ratio: number;

  // ================================================================================

  @ForeignKey(() => Multilink)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  multilinkId: number;

  @BelongsTo(() => Multilink)
  multilink: Multilink;
}