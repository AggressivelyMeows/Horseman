import { router } from '../../router.js'
import { Table } from '../../lib/table.js'

// {
//     "id": "horseman-news",
//     "spec": [
//         {
//             "name": "Title",
//             "type": "string",
//             "args": {},
//             "index": true
//         },
//         {
//             "name": "Content",
//             "type": "html",
//             "args": {}
//         },
//         {
//             "name": "Tags",
//             "type": "tag",
//             "args": {},
//             "index": true
//         },
//         {
//             "name": "__all_objects_index",
//             "type": "string",
//             "index": true
//         }
//     ],
//     "options": {
//         "title_field": "Title"
//     },
// }

const generate_model = (name, spec, options) => {
    return {
        id: name,
        spec: spec,
        options: options
    }
}

router.get(router.version + '/presets', async (req, res) => {
    const presets = [
        {
            name: 'Blog',
            desc: 'A preset that gets you setup for writing blogs',
            models: [
                generate_model(
                    'posts',
                    [
                        {
                            name: 'Title',
                            type: 'string',
                            args: {},
                            index: true,
                            help: 'The title of the blog post.'
                        },
                        {
                            name: 'Author',
                            type: 'relationship',
                            args: {
                                model: 'authors'
                            },
                            index: true,
                            help: 'This is your author profile. If you havent made one yet, swap over to the "Authors" tab and create one. Make sure to publish it and then come back.'
                        },
                        {
                            name: 'Content',
                            type: 'html',
                            args: {}
                        },
                        {
                            name: 'Tags',
                            type: 'tag',
                            args: {},
                            index: true
                        }
                    ],
                    {
                        title_field: 'Title',
                        preset: true
                    }
                ),
                generate_model(
                    'authors',
                    [
                        {
                            name: 'Name',
                            type: 'string',
                            args: {},
                            index: true
                        },
                        {
                            name: 'Biography',
                            type: 'html',
                            args: {}
                        },
                        {
                            name: 'Image',
                            type: 'string',
                            args: {},
                            help: 'A URL of your avatar goes here.'
                        }
                    ],
                    {
                        title_field: 'Name',
                        preset: true
                    }
                )
            ]
        },
        {
            name: 'Portfolio',
            desc: 'A preset that gets you setup for writing portfolios',
            models: [
                generate_model(
                    'projects',
                    [
                        {
                            name: 'Title',
                            type: 'string',
                            args: {},
                            index: true,
                            help: 'The title of the project.'
                        },
                        {
                            name: 'Tags',
                            type: 'tag',
                            args: {},
                            index: true,
                            help: 'Any tags you want to associate to this project, for example "Vue.JS", "Tailwind", "Python", "PHP".'
                        },
                        {
                            name: 'Image',
                            type: 'string',
                            args: {},
                            index: false,
                            help: 'The image that will be used to represent this project on your home page or portfolio page.'
                        },
                        {
                            name: 'Content',
                            type: 'html',
                            args: {},
                            help: 'Give us a description of your project, what you did, how you did it, what are you proud of, etc.'
                        }
                    ],
                    {
                        title_field: 'Title',
                        preset: true
                    }
                ),
                generate_model(
                    'authors',
                    [
                        {
                            name: 'Name',
                            type: 'string',
                            args: {},
                            index: true
                        },
                        {
                            name: 'Biography',
                            type: 'html',
                            args: {}
                        },
                        {
                            name: 'Image',
                            type: 'string',
                            args: {}
                        }
                    ],
                    {
                        title_field: 'Name',
                        preset: true
                    }
                )
            ]
        }
    ]

    res.body = {
        success: true,
        presets
    }
})