import React, { Component } from 'react'
import Loader from './Loader'

class Collection extends Component {
    constructor() {
        super()
        this.state = {
            tuples : null
        }
        this.deleteTuple = this.deleteTuple.bind(this)
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

    render() {
        if(this.state.tuples)
        return (
            <div id="tuples">
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
