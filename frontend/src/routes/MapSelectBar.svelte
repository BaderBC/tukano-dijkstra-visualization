<script>
    import {Button, TextInput} from "@svelteuidev/core";
    import MapSelectButton from "./MapSelectButton.svelte";

    const mapNames = ['test1', 'test2', 'mapa fajna'];
</script>

<div id="bar">
    <div class="button-as-input-label">
        <Button style="border: 0; border-radius: 0">Dodaj</Button>
        <TextInput style="border: 0; border-radius: 0" placeholder="Nazwa mapy"/>
    </div>
    {#each mapNames as mapName}
        <MapSelectButton mapName={mapName}/>
    {/each}
    <MapSelectButton current mapName="current"/>
</div>

<style>
    #bar {
        gap: 10px;
        display: flex;
        flex-direction: row;
        margin-bottom: 20px;
    }

    .button-as-input-label {
        display: flex;
        border-radius: 15px;
        overflow: hidden;
        border: 1px solid lightgray;
    }
</style>
