// const expect = require('expect');

module.exports = function(plugin, change) {
    const { state } = change;
    const { selection } = state;

    const range = selection.merge({
        anchorKey: '_selection_key',
        anchorOffset: 2,
        focusKey: '_selection_key',
        focusOffset: 2
    });

    change.select(range)
         .call(plugin.changes.splitListItem)
         .undo();

    // TODO fix undo, and test selection
    // Back to previous cursor position
    // expect(state.startBlock.text).toEqual(initialText);
    // expect(state.selection.toJS()).toEqual(initialSelection.toJS());

    return change;
};
