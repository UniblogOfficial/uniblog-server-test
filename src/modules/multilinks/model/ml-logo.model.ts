import { ApiProperty } from '@nestjs/swagger';
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { MLContentType, Multilink } from './multilink.model';

interface MLLogoCreationAttributes {
  multilinkId: number;
  order: number;
  type: MLContentType;

  logo: string;
  banner?: string;
  size?: number;
  hAlign?: string;
  vAlign?: string;

  padding?: number[];
  margin?: number[];
  background?: string;
}

@Table({ tableName: 'mllogos' })
export class MLLogo extends Model<MLLogo, MLLogoCreationAttributes> {
  @ApiProperty({ example: '69', description: 'Unique MLLogo ID' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: '0', description: 'ML content order value' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  order: number;

  @Column({ type: DataType.ARRAY(DataType.FLOAT) })
  padding: number[];

  @Column({ type: DataType.ARRAY(DataType.FLOAT) })
  margin: number | number[];

  @ApiProperty({ example: '#ff0', description: 'ML block CSS background' })
  @Column({ type: DataType.STRING })
  background: string;

  @ApiProperty({ example: 'logo', description: 'ML content type' })
  @Column({ type: DataType.STRING, allowNull: false })
  type: MLContentType;

  // ================================================================================

  @Column({ type: DataType.STRING, allowNull: false })
  logo: string;

  @Column({ type: DataType.STRING })
  banner: string;

  @Column({ type: DataType.INTEGER })
  size: number;

  @Column({ type: DataType.STRING })
  hAlign: string; // 'right' | 'left' | 'center';

  @Column({ type: DataType.STRING })
  vAlign: string; // 'top' | 'center' | 'bottom';

  @ForeignKey(() => Multilink)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  multilinkId: number;

  @BelongsTo(() => Multilink)
  multilink: Multilink;
}