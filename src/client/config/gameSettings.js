export default {
    commands: [
        {
            action: 'Rotate the piece',
            code: 'ArrowUp',
            type: 'arrow',
            key: '▲',
            // key: '↑',
        },
        {
            action: 'Move the piece to the bottom',
            code: 'ArrowDown',
            type: 'arrow',
            key: '▼',
            // key: '↓',
        },
        {
            action: 'Move the piece to the left',
            code: 'ArrowLeft',
            type: 'arrow',
            key: '◄',
            // key: '←',
        },
        {
            action: 'Move the piece to the right',
            code: 'ArrowRight',
            type: 'arrow',
            key: '►',
            // key: '→',
        },
        {
            action: 'Drop the piece',
            type: 'space',
            code: 'Space',
            key: 'Space',
        },
    ],
};
