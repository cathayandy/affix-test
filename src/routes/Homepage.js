import React, { PureComponent, Fragment } from 'react';
import { Menu, Affix } from 'antd';
const { Item } = Menu;
const menuStyle = {
    lineHeight: 'inherit',
    float: 'right',
    border: 0,
};
const sections = [
    'item1', 'item2', 'item3', 'item4',
];

export default class Homepage extends PureComponent {
    renderNavItems() {
        return sections.map(item => (
            <Item key={item}>
                <a href={`#${item}`}>{ item }</a>
            </Item>
        ));
    }
    renderSections() {
        return sections.map(item => (
            <div key={item} className="wrapper block">
                <h1 id={item}>{ item }</h1>
            </div>
        ));
    }
    render() {
        return (
            <Fragment>
                <Affix offsetTop={0}>
                    <div id="header">
                        <div className="wrapper">
                            <Menu
                                mode="horizontal"
                                style={menuStyle}
                                defaultSelectedKeys={['item1']}
                            >
                                { this.renderNavItems() }
                            </Menu>
                        </div>
                    </div>
                </Affix>
                { this.renderSections() }
            </Fragment>
        );
    }
}
