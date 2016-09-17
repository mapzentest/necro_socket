var SortDirection;
(function (SortDirection) {
    SortDirection[SortDirection["Asc"] = 0] = "Asc";
    SortDirection[SortDirection["Desc"] = 1] = "Desc";
})(SortDirection || (SortDirection = {}));
var SortTypes;
(function (SortTypes) {
    SortTypes[SortTypes["IV"] = 0] = "IV";
    SortTypes[SortTypes["Update"] = 1] = "Update";
    SortTypes[SortTypes["Level"] = 2] = "Level";
    SortTypes[SortTypes["Rarity"] = 3] = "Rarity";
})(SortTypes || (SortTypes = {}));
var PokemonRarities;
(function (PokemonRarities) {
    PokemonRarities[PokemonRarities["Common"] = 0] = "Common";
    PokemonRarities[PokemonRarities["Uncommon"] = 1] = "Uncommon";
    PokemonRarities[PokemonRarities["Rare"] = 2] = "Rare";
    PokemonRarities[PokemonRarities["VeryRare"] = 3] = "VeryRare";
    PokemonRarities[PokemonRarities["SuperRare"] = 4] = "SuperRare";
})(PokemonRarities || (PokemonRarities = {}));
