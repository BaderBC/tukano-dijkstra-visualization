import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { DijkstraGraphDto } from './dto/dijkstraGraphDto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/dijkstra')
  runDijkstra(@Body() graph: DijkstraGraphDto): {
    path: string[];
    distance: number;
  } {
    if (!graph.nodes.some((node) => node.name === graph.startNode)) {
      throw new HttpException(
        'Start node not found in nodes',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!graph.nodes.some((node) => node.name === graph.endNode)) {
      throw new HttpException(
        'End node not found in nodes',
        HttpStatus.BAD_REQUEST,
      );
    }

    graph = this.ensureCorrectGraphPaths(graph);

    const res = this.appService.runDijkstra(
      graph.nodes,
      graph.startNode,
      graph.endNode,
    );

    console.log(`Path: ${res.path}, Distance: ${res.distance}`);

    return res;
  }

  ensureCorrectGraphPaths(graph: DijkstraGraphDto): DijkstraGraphDto {
    for (const node of graph.nodes) {
      // if node A has an edge to node B, then make sure node B has an edge to node A
      for (const edge of node.edges) {
        if (
          !graph.nodes
            .find((e) => e.name === edge.to)
            ?.edges.some((e) => e.to === node.name)
        ) {
          graph.nodes
            .find((e) => e.name === edge.to)
            ?.edges.push({ to: node.name, weight: edge.weight });
        }
      }
    }

    return graph;
  }
}
