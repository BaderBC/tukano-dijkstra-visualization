<script context="module" lang="ts">
    export const START_NODE = 'S';
    export const END_NODE = 'P';

    export const BACKEND_URL = 'http://localhost:3000';

    export interface Edge {
        to: string;
        weight: number;
    }

    export interface Node {
        id: string;
        edges: Edge[];
        x?: number;
        y?: number;
    }

    export class GraphClass {
        nodes: Node[];
        serializedNodes: string = '';
        shortestPath: string[] | null = null;
        shortestPathDistance: number | null = null;

        constructor(nodes: Node[]) {
            this.nodes = nodes;
            this.onUpdate();
        }

        static fromJSON(json: string): GraphClass {
            const obj = JSON.parse(json);
            const graph = new GraphClass([]);

            const nodeMap: { [key: string]: Node } = {};
            for (const nodeId of obj.nodes) {
                const node: Node = { id: nodeId, edges: [] };
                nodeMap[nodeId] = node;
                graph.nodes.push(node);
            }

            for (const edge of obj.edges) {
                const fromNode = nodeMap[edge.from];
                if (fromNode) {
                    fromNode.edges.push({ to: edge.to, weight: edge.weight });
                }
            }

            graph.onUpdate();
            return graph;
        }

        toJSON(): string {
            const obj: any = {
                nodes: this.nodes.map(node => node.id),
                edges: []
            };

            for (const node of this.nodes) {
                for (const edge of node.edges) {
                    obj.edges.push({ from: node.id, to: edge.to, weight: edge.weight });
                }
            }

            return JSON.stringify(obj, null, 2);
        }

        getNode(nodeName: string): Node | null {
            return this.nodes.find(node => node.id === nodeName) || null;
        }

        addNodeByName(name: string) {
            this.nodes.push({
                id: name,
                edges: [],
            });
            this.onUpdate();
        }

        addPath(startNodeName: string, endNodeName: string, weight: number) {
            const startNode = this.getNode(startNodeName);
            const endNode = this.getNode(endNodeName);

            if (!startNode || !endNode) throw new Error("Node not found");

            startNode.edges.push({
                to: endNodeName,
                weight,
            });
            this.onUpdate();
        }

        private onUpdate() {
            this.generateGridCoordinates(400, 200);
            this.serializedNodes = this.toJSON();
        }

        generateGridCoordinates(width: number, height: number) {
            const numNodes = this.nodes.length;
            const cols = Math.ceil(Math.sqrt(numNodes));
            const rows = Math.ceil(numNodes / cols);
            const xSpacing = width / (cols + 1);
            const ySpacing = height / (rows + 1);

            this.nodes.forEach((node, index) => {
                const col = index % cols;
                const row = Math.floor(index / cols);
                node.x = col * xSpacing;
                node.y = row * (ySpacing + 10);
            });
        }

        private lastDijkstraRunSerializedNodes: string = '';

        async dijkstra(): Promise<{ path: string[]; distance: number; }> {
            // Cache:
            if (this.serializedNodes === this.lastDijkstraRunSerializedNodes) {
                //return  {
                //    path: this.shortestPath!,
                //    distance: this.shortestPathDistance!,
                //}
            }

            const res = await fetch(`${BACKEND_URL}/dijkstra`, {
                method: 'POST',
                credentials: 'omit',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nodes: this.nodes.map(e => ({
                        name: e.id,
                        edges: e.edges
                    })),
                    startNode: START_NODE,
                    endNode: END_NODE,
                }),
            });

            if (!res.ok) {
                throw new Error((await res.json()).message);
            }

            this.lastDijkstraRunSerializedNodes = this.serializedNodes;
            const dijkstraResult = await res.json();
            
            this.shortestPath = dijkstraResult.path;
            this.shortestPathDistance = dijkstraResult.distance;
            
            return dijkstraResult;
        }
    }
</script>

<script lang="ts">
    import {onMount} from 'svelte';
    import {derived, type Writable, writable} from 'svelte/store';

    export let graph: Writable<GraphClass>;

    const stickManPosition = writable<{ x: number, y: number }>({
        x: $graph.getNode(START_NODE)?.x || 0,
        y: $graph.getNode(START_NODE)?.y || 0,
    });

    function moveStickMan(path: string[], duration: number = 1000) {
        let index = 0;

        function animate() {
            if (index >= path.length - 1) return;

            const currentNode = $graph.nodes.find(n => n.id === path[index]);
            const nextNode = $graph.nodes.find(n => n.id === path[index + 1]);

            if (!currentNode || !nextNode) return;

            const startX = currentNode.x! + 25;
            const startY = currentNode.y! + 25;
            const endX = nextNode.x! + 25;
            const endY = nextNode.y! + 25;

            const startTime = performance.now();
            const endTime = startTime + duration;

            function step(currentTime: number) {
                const t = (currentTime - startTime) / (endTime - startTime);
                const x = startX + (endX - startX) * t;
                const y = startY + (endY - startY) * t;

                stickManPosition.set({x, y});

                if (t < 1) {
                    requestAnimationFrame(step);
                } else {
                    index++;
                    requestAnimationFrame(animate);
                }
            }

            requestAnimationFrame(step);
        }

        animate();
    }

    onMount(() => {
        derived(graph, ($g) => $g.shortestPath).subscribe(() => {
            moveStickMan($graph.shortestPath || []);
        });
    });
</script>

<style>
    .node {
        display: inline-block;
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        margin: 10px;
        border-radius: 50%;
        background: lightblue;
        position: absolute;
    }

    .edge {
        stroke: black;
        stroke-width: 2;
    }

    .graph {
        position: relative;
        width: 400px;
        height: 200px;
        border: 1px solid #ccc;
    }

    .stick-man {
        position: absolute;
        width: 40px;
        height: 40px;
        background-image: url('/parrot.svg');
        background-size: 100% 100%;
        transition: transform 1s ease;
        transform: translate(-10px, -20px);
    }
</style>

<div class="graph">
    <svg width="100%" height="100%">
        {#each $graph.nodes as node}
            {#each node.edges as edge}
                {#if $graph.nodes.find(n => n.id === edge.to)}
                    <line class="edge" x1={node.x + 25} y1={node.y + 25}
                          x2={$graph.nodes.find(n => n.id === edge.to).x + 25}
                          y2={$graph.nodes.find(n => n.id === edge.to).y + 25}/>
                {/if}
            {/each}
        {/each}
    </svg>

    {#each $graph.nodes as node (node.id)}
        <div class="node" style="left: {node.x}px; top: {node.y}px;">
            {node.id}
        </div>
    {/each}

    <div class="stick-man" style="left: {$stickManPosition.x}px; top: {$stickManPosition.y}px;"></div>
</div>
