interface TypesObject{
    slot: number,
    type:{
        name: string,
        url: string
    }
}

interface MovesObject{
    move:{
        name: string 
    }
}

interface SpritesObject{
    back_default:string,
    back_shiny:string,
    front_default:string,
    front_shiny:string
}

interface Pokemon{
    name:string,
    sprites:SpritesObject,
    types:Array<TypesObject>,
    moves:Array<MovesObject>
}

export type { TypesObject, MovesObject, SpritesObject, Pokemon }