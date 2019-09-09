import React, { Component } from 'react'
import Loader from './Loader'

class Collection extends Component {
    constructor() {
        super()
        this.state = {
            tuples : null
        }
        this.deleteTuple = this.deleteTuple.bind(this)
        this.createTuple = this.createTuple.bind(this)
        this.updateTuple = this.updateTuple.bind(this)
        this.updateMultipleTuples = this.updateMultipleTuples.bind(this)
    }

    componentDidMount() {
        fetch('http://localhost:3000/collection?db='+this.props.db+'&collection=' + this.props.collection)
        .then(res => res.json())
        .then(data => this.setState({ tuples : [...data]}))
    }

    deleteTuple(db, collection, key) {
        let unique = {_id : key}
        fetch('http://localhost:3000/delete', {
            method : 'DELETE',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({dbName : db, collection, unique})
        })
        .then(data => data.json())
        .then(data => {
            if(data.success) {
                let tuples = this.state.tuples
                return tuples.filter(obj => obj._id === key ? 0 : 1)
            } else return 0
        })
        .then(data => {
            if(data) this.setState({tuples : [...data]})
        })
    }

    createTuple() {
        let textareaSelector = document.querySelector('textarea[name="tupleName"]')
        let tuples = textareaSelector.value 
        tuples = tuples.split('\n').map(obj => {
            return JSON.parse(obj)
        })
        fetch('http://localhost:3000/insert', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({dbName : this.props.db, collection : this.props.collection, object : {tuples : [...tuples]}})
        })
        .then(res => res.json())
        .then(data => data.tuple.ops)
        .then(data => {
            let tuples = [...this.state.tuples]
            data.map(tuple => {
                tuples.push(tuple)
            })
            return tuples 
        })
        .then(tuples => {
            this.setState({tuples : [...tuples]})
            textareaSelector.value = ""
        })
    }

    updateTuple(uniqueId) {
        let textareaSelector = document.querySelector(`textarea[name="updateValue-${uniqueId}"]`)
        let newVal = textareaSelector.value
        newVal = JSON.parse(newVal)
        let unique = { _id : uniqueId}
        fetch('http://localhost:3000/update', {
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({dbName : this.props.db, collection : this.props.collection, uniqueId : unique, newVal})
        })
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                let tuples = [...this.state.tuples]
                tuples = tuples.map(tuple => {
                    if(tuple['_id'] === uniqueId) {
                        for(const key in newVal) {
                            tuple[key] = newVal[key]
                        }
                    }
                    return tuple
                })
                this.setState({tuples : [...tuples]})
                textareaSelector.value = ""
            }
        })
    }

    updateMultipleTuples() {
        let updateWhereSelector = document.querySelector('textarea[name="updateWhere"]')
        let key = updateWhereSelector.value
        key = JSON.parse(key)
        let updateToSelector = document.querySelector('textarea[name="updateTo"]')
        let newVal = updateToSelector.value
        newVal = JSON.parse(newVal)
        fetch('http://localhost:3000/updatemulti', {
            method : "PUT",
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({dbName : this.props.db, collection : this.props.collection, key, newVal})
        })
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                let tuples = this.state.tuples
                tuples = tuples.map(tuple => {
                    let isTupleMatch = 1
                    for(const keys in key) {
                        if(!(tuple.hasOwnProperty(keys) && tuple[keys] === key[keys])) {
                            isTupleMatch = 0
                            break
                        }
                    }
                    if(isTupleMatch) {
                        for(const keys in newVal) {
                            tuple[keys] = newVal[keys]
                        }
                    }
                    return tuple
                })
                this.setState({ tuples : [...tuples]})
                updateToSelector.value = ""
                updateWhereSelector.value = ""
            }
        })
    }

    render() {
        if(this.state.tuples)
        return (
            <div id="tuples">
                <div className="columns">
                    <div className="column is-5">
                        <div className="field">
                            <div className="control">
                                <textarea  className="textarea" placeholder='{ "key" : "value", "key2" : "value2" }&#10;{"key" : "value2"}' name="tupleName" rows="2"/>
                            </div>
                        </div>
                    </div>
                    <div className="column is-1">
                        <div className="field">
                            <div className="control">
                                <button className="button is-success" onClick={this.createTuple}>Insert</button>
                            </div>
                        </div>
                    </div>
                    <div className="column is-5">
                        <div className="field">
                            <div className="control">
                                <textarea className="textarea" name="updateWhere" rows="1" placeholder='{ "key" : "oldValue" }'></textarea>
                            </div>
                            <div className="control">
                                <textarea className="textarea" name="updateTo" rows="1" placeholder='{ "key" : "newValue" }'></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="column is-1">
                        <div className="field">
                            <div className="control">
                                <button className="button is-success" onClick={this.updateMultipleTuples}>Update</button>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.tuples.map((obj, ind) => {
                    return (
                        <div className="notification" key={ind}>
                            {Object.keys(obj).map(key => {
                                return(<h1 key={obj[key]}> <span className="has-text-weight-bold">{key}</span> : {typeof obj[key] === "string" ? '"'+obj[key]+'"' : obj[key]}</h1>)
                            })}
                            <br/>
                            <a className="delete" onClick={() => this.deleteTuple(`${this.props.db}`, `${this.props.collection}`, `${obj['_id']}`)}></a>
                            <div className="field is-grouped columns">
                                <div className="control column is-4">
                                    <textarea className="textarea" placeholder='{ "key" : "updatedValue" }' rows="1" name={`updateValue-${obj['_id']}`}></textarea>
                                </div>
                                <div className="control buttons column is-3">
                                    <button className="button" onClick={() => this.updateTuple(`${obj['_id']}`)}>Update</button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
        else 
            return (
                <Loader/>
            )
    }
}

export default Collection
