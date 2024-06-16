import { Injectable } from '@nestjs/common';
import { NodeDto } from './dto/dijkstraGraphDto';

@Injectable()
export class AppService {
  runDijkstra(
    nodes: NodeDto[],
    startNode: string,
    endNode: string,
  ): { path: string[]; distance: number } {
    const distances: any = {};
    const previous: any = {};
    const pq = new PriorityQueue<string>();

    for (const node of nodes) {
      distances[node.name] = Infinity;
      previous[node.name] = null;
    }

    distances[startNode] = 0;
    pq.enqueue(startNode, 0);

    while (!pq.isEmpty()) {
      const currentNode = pq.dequeue()!;

      if (currentNode === endNode) {
        break;
      }

      for (const neighbor of nodes.find((e) => e.name === currentNode)?.edges ||
        []) {
        const alt = distances[currentNode] + neighbor.weight;

        if (alt < distances[neighbor.to]) {
          distances[neighbor.to] = alt;
          previous[neighbor.to] = currentNode;
          pq.enqueue(neighbor.to, alt);
        }
      }
    }

    const path: string[] = [];
    let current = endNode;

    while (current !== null) {
      path.unshift(current);
      current = previous[current] || null;
    }

    if (path[0] !== startNode) {
      return { path: [], distance: Infinity };
    }

    return { path, distance: distances[endNode] };
  }
}

class PriorityQueue<T> {
  private items: { element: T; priority: number }[] = [];

  enqueue(element: T, priority: number) {
    const queueElement = { element, priority };
    let added = false;

    for (let i = 0; i < this.items.length; i++) {
      if (queueElement.priority < this.items[i].priority) {
        this.items.splice(i, 0, queueElement);
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(queueElement);
    }
  }

  dequeue(): T | undefined {
    return this.items.shift()?.element;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}
