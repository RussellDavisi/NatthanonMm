const React = require('react');
const ReactDOM = require('react-dom');
const Slate = require('slate');
const { Editor } = require('slate-react');
const yaml = require('yaml-js');

const PluginEditList = require('../lib/');

const stateJson = yaml.load(require('./state.yaml'));

const plugin = PluginEditList();
const plugins = [plugin];

const highlightedItems = (props) => {
    const { node, state } = props;
    const isCurrentItem = plugin.utils.getItemsAtRange(state).contains(node);

    return (
        <li className={isCurrentItem ? 'current-item' : ''}
            title={isCurrentItem ? 'Current Item' : ''}
            {...props.attributes}>
            {props.children}
        </li>
    );
};
// To update the highlighting of nodes inside the selection
highlightedItems.suppressShouldComponentUpdate = true;

const SCHEMA = {
    nodes: {
        ul_list:   props => <ul {...props.attributes}>{props.children}</ul>,
        ol_list:   props => <ol {...props.attributes}>{props.children}</ol>,

        list_item: highlightedItems,

        paragraph: props => <p {...props.attributes}>{props.children}</p>,
        heading:   props => <h1 {...props.attributes}>{props.children}</h1>
    }
};

class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = { state: Slate.State.fromJSON(stateJson) };
        this.onChange = this.onChange.bind(this);
    }

    onChange({ state }) {
        this.setState({
            state
        });
    }

    call(change) {
        this.setState({
            state: this.state.state.change().call(change).state
        });
    }

    renderToolbar() {
        const { wrapInList, unwrapList, increaseItemDepth, decreaseItemDepth } = plugin.changes;
        const inList = plugin.utils.isSelectionInList(this.state.state);

        return (
            <div>
                <button className={inList ? 'active' : ''}
                        onClick={() => this.call(inList ? unwrapList : wrapInList)}>
                    <i className="fa fa-list-ul fa-lg"></i>
                </button>

                <button className={inList ? '' : 'disabled'}
                        onClick={() => this.call(decreaseItemDepth)}>
                    <i className="fa fa-outdent fa-lg"></i>
                </button>

                <button className={inList ? '' : 'disabled'}
                        onClick={() => this.call(increaseItemDepth)}>
                    <i className="fa fa-indent fa-lg"></i>
                </button>

                <span className="sep">·</span>

                <button onClick={() => this.call(wrapInList)}>Wrap in list</button>
                <button onClick={() => this.call(unwrapList)}>Unwrap from list</button>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.renderToolbar()}
                <Editor placeholder={'Enter some text...'}
                        plugins={plugins}
                        state={this.state.state}
                        onChange={this.onChange}
                        schema={SCHEMA} />
            </div>
        );
    }
}

ReactDOM.render(
    <Example />,
    document.getElementById('example')
);
