
const get_object = async (userID, model, index, search) => {
    // Finds an object from the database
    const key = `${userID}:${model}:${index}`

    const data = await INDEXKV.get(key, { type: 'json', cacheTtl: 120 })

    if (!data) {
        return {
            success: false,
            error: 'This object/index combo does not exist',
            code: 'IDX_NOT_FOUND'
        }
    }

    const objectID = data.find(o => {
        // o is in the format of [ "objectID", "indexed string result" ]
        return o[1] == search
    })

    if (!objectID) {
        return null
    }

    return {
        success: true,
        object: await OBJECTKV.get(`${userID}:${model}:${objectID}`, { type: 'json', cacheTtl: 420 })
    }
}

const create_schema = async (userID, model, spec) => {

}

const create_object = (userID, model, index, search) => {
    // Finds an object from the database
    const key = `${userID}:${model}:${index}`

    const data = await INDEXKV.get(key, { type: 'json', cacheTtl: 120 })
}

export {
    get_object,
    create_object
}