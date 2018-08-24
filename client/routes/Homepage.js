import React, { PureComponent } from 'react';
import {
    Tabs, List, Avatar, Button, InputNumber, Input, Icon,
} from 'antd';
import moment from 'moment';
const { TabPane } = Tabs;
const tabs = [{
    title: '🐨小考拉', key: 'venchi',
}, {
    title: '🐰小白兔鸭', key: 'cathayandy',
}];
function getColor(date) {
    return `#${Math.floor(date * 7 % 16777215).toString(16)}`;
}

export default class Homepage extends PureComponent {
    constructor(props) {
        super(props);
        this.addItem = this.addItem.bind(this);
        this.onTabChange = this.onTabChange.bind(this);
        this.updateCount = this.updateCount.bind(this);
        this.updateTitle = this.updateTitle.bind(this);
        this.state = {
            tabKey: 'venchi',
            newItem: {
                count: 1,
                title: '',
            },
            data: {},
        };
    }
    updateCount(value) {
        this.setState({ newItem: {
            ...this.state.newItem,
            count: value,
        }});
    }
    updateTitle(e) {
        this.setState({ newItem: {
            ...this.state.newItem,
            title: e.target.value,
        }});
    }
    onTabChange(key) {
        this.setState({
            tabKey: key,
        });
        this.getList(key);
    }
    addItem() {
        const { tabKey } = this.state;
        const { title, count } = this.state.newItem;
        return fetch(`/api/events`, {
            method: 'POST',
            body: `user=${tabKey}&title=${title}&count=${count}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
            },
        })
            .then(res => res.json())
            .then(() => this.getList(tabKey));
    }
    deleteItem(id) {
        const { tabKey } = this.state;
        return fetch(`/api/events`, {
            method: 'DELETE',
            body: `user=${tabKey}&id=${id}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
            },
        })
            .then(res => res.json())
            .then(() => this.getList(tabKey));
    }
    getList(key) {
        return fetch(`/api/events?user=${key}`)
            .then(res => res.json())
            .then(res => this.setState({
                data: {
                    ...this.state.data,
                    [key]: res,
                },
            }));
    }
    componentDidMount() {
        this.getList(this.state.tabKey);
    }
    renderEvents(events) {
        return (
            <List
                itemLayout="horizontal"
                dataSource={[{ time: '__new__' }, ...events]}
                renderItem={({count, title, time}) => time === '__new__' ? (
                    <List.Item
                        actions={[<Button
                            className="add-new"
                            onClick={this.addItem}
                            type="primary" shape="circle" icon="plus"
                        />]}
                    >
                        <List.Item.Meta
                            avatar={<InputNumber
                                value={this.state.newItem.count}
                                placeholder="次数"
                                onChange={this.updateCount}
                            />}
                            title={<Input
                                value={this.state.newItem.title}
                                placeholder="备注"
                                onChange={this.updateTitle}
                            />}
                        />
                    </List.Item>
                ) : (
                    <List.Item
                        actions={[<a
                            onClick={() => this.deleteItem(time)}
                        >
                            <Icon type="close" />
                        </a>]}
                    >
                        <List.Item.Meta
                            avatar={
                                <Avatar style={{
                                    background: getColor(time),
                                }}>
                                    { count }
                                </Avatar>
                            }
                            title={title}
                            description={moment(time).format()}
                        />
                    </List.Item>
                )}
                pagination={{
                    size: 'small', total: events.length + 1, pageSize: 5,
                }}
            />
        );
    }
    renderTab({ title, key }) {
        const events = this.state.data[key] || [];
        const sum = events.reduce((prev, cur) => prev + cur.count, 0);
        return (
            <TabPane tab={title} key={key}>
                <h1>{ sum }</h1>
                { this.renderEvents(events) }
            </TabPane>
        );
    }
    render() {
        return (
            <Tabs onChange={this.onTabChange}>
                { tabs.map(tab => this.renderTab(tab)) }
            </Tabs>
        );
    }
}
