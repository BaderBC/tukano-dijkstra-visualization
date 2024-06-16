<script lang="ts">
    import {Button, TextInput} from "@svelteuidev/core";

    export let addPath: (startNodeName: string, endNodeName: string, weight: number) => void;

    let fromNode: string = '';
    let toNode: string = '';
    let weight: string = '';

    function onAddPath() {
        if (fromNode === '' || toNode === '' || weight === '') return;
        let parsedWeight = parseInt(weight);
        if (isNaN(parsedWeight)) return;

        addPath(fromNode, toNode, parsedWeight);
        
        fromNode = '';
        toNode = '';
        weight = '';
    }
</script>

<div class="button-as-input-label">
    <TextInput bind:value={fromNode} style="border: 0; border-bottom: 1px solid lightgray; border-radius: 0"
               placeholder="From node"/>
    <TextInput bind:value={toNode} style="border: 0; border-bottom: 1px solid lightgray; border-radius: 0"
               placeholder="To node"/>
    <TextInput bind:value={weight} style="border: 0; border-bottom: 1px solid lightgray; border-radius: 0"
               placeholder="Weight"/>
    <Button on:click={onAddPath} style="border: 0; border-radius: 0; width: 100%;">Add Path</Button>
</div>

<style>
    .button-as-input-label {
        display: flex;
        flex-direction: column;
        border-radius: 15px;
        overflow: hidden;
        border: 1px solid lightgray;
    }
</style>
