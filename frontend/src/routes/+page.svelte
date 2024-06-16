<script lang="ts">
    import {type Writable, writable} from 'svelte/store';
    import Graph, {GraphClass} from './Graph.svelte';
    import {Button, TextInput} from "@svelteuidev/core";
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
    
    let nodeToAddName: string = '';
    function addNode() {
        if(nodeToAddName === '') return;
        graphData.addNodeByName(nodeToAddName);
        graph.set(graphData);
        nodeToAddName = '';
    }
    
    function addPath(fromNode: string, toNode: string, weight: number) {
        graphData.addPath(fromNode, toNode, weight);
        graph.set(graphData);
    }
    
    async function runDijkstra() {
        console.log(graphData);
        
        await graphData.dijkstra();
        console.log(graphData.shortestPath, graphData.shortestPathDistance);
        graph.set(graphData);
    }
</script>

<main>
    <h1>Dijkstra's Algorithm Visualization</h1>
    <MapSelectBar/>
    <Graph bind:graph/>
    <div style="display: flex; flex-direction: row; gap: 15px; margin: 15px 0">
        <div class="button-as-input-label">
            <Button on:click={addNode} style="border: 0; border-radius: 0">Add Node</Button>
            <TextInput style="border: 0; border-radius: 0" bind:value={nodeToAddName} placeholder="Node name"/>
        </div>
        <Button on:click={runDijkstra} style="border-radius: 15px">Run dijkstra</Button>
    </div>
    <AddPath {addPath}/>
</main>

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
