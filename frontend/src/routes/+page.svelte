<script lang="ts">
    import {type Writable, writable} from 'svelte/store';
    import Graph, {GraphClass} from './Graph.svelte';
    import {Button, SvelteUIProvider, TextInput} from "@svelteuidev/core";
    import MapSelectBar from "./MapSelectBar.svelte";
    import AddPath from "./AddPath.svelte";

    const graphData = new GraphClass([
        {id: 'A', edges: [{to: 'B', weight: 1}, {to: 'C', weight: 4}]},
        {id: 'B', edges: [{to: 'C', weight: 2}, {to: 'D', weight: 5}]},
        {id: 'C', edges: [{to: 'D', weight: 1}]},
        {id: 'D', edges: []},
        {id: 'E', edges: [{to: 'A', weight: 1}]},
    ]);
    let graph = writable<GraphClass>(graphData);
    let runDijkstraAnimation: () => void;

    let nodeToAddName: string = '';

    function addNode() {
        if (nodeToAddName === '') return;
        $graph.addNodeByName(nodeToAddName);
        graph.update(e => e);
        nodeToAddName = '';
    }

    function addPath(fromNode: string, toNode: string, weight: number) {
        $graph.addPath(fromNode, toNode, weight);
        graph.update(e => e);
    }

    async function runDijkstra() {
        await $graph.dijkstra();
        graph.update(e => e);
        runDijkstraAnimation();
    }
</script>

<SvelteUIProvider>
    <main>
        <h1>Dijkstra's Algorithm Visualization</h1>
        <MapSelectBar bind:graph/>
        <Graph bind:graph bind:runDijkstraAnimation/>
        {#if ($graph.shortestPath)}
            <p style="margin-bottom: 10px">Distance of the shortest path: {$graph.shortestPathDistance}</p>
        {/if}
        <div style="display: flex; flex-direction: row; gap: 10px; margin: 15px 0">
            <div class="button-as-input-label">
                <Button on:click={addNode} style="border: 0; border-radius: 0">Add Node</Button>
                <TextInput style="border: 0; border-radius: 0" bind:value={nodeToAddName} placeholder="Node name"/>
            </div>
            <Button on:click={runDijkstra} style="border-radius: 15px">Run dijkstra</Button>
        </div>
        <AddPath {addPath}/>
    </main>
</SvelteUIProvider>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
    }

    .button-as-input-label {
        display: flex;
        border-radius: 15px;
        overflow: hidden;
        border: 1px solid lightgray;
    }
</style>
