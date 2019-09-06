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
        let tuples = document.querySelector('textarea[name="tupleName"]').value 
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
        .then(tuples => this.setState({tuples : [...tuples]}))
    }

    render() {
        if(this.state.tuples)
        return (
            <div id="tuples">
                <div className="columns">
                    <div className="column is-5">
                        <div className="field">
                            <div className="control">
                                <textarea  className="textarea" placeholder='{ "key" : "value", "key2" : "value2" }&#10;{"key" : "value2"}' name="tupleName"/>
                            </div>
                        </div>
                    </div>
                    <div className="column is-1">
                    <div className="field">
                            <div className="control">
                                <button className="button is-success" onClick={this.createTuple}>Create Collection</button>
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
                            <a className="delete" onClick={() => this.deleteTuple(`${this.props.db}`, `${this.props.collection}`, `${obj['_id']}`)}></a>
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
