import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class DijkstraGraphDto {
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(2)
  nodes: NodeDto[];

  @IsString()
  @IsNotEmpty()
  startNode: string;

  @IsString()
  @IsNotEmpty()
  endNode: string;
}

export class NodeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsString({ each: true })
  edges: EdgeDto[] = [];
}

export class EdgeDto {
  @IsString()
  @IsNotEmpty()
  to: string;

  @IsNumber()
  @IsNotEmpty()
  weight: number;
}
