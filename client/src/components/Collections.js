import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Loader from './Loader'

class Collections extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collections : null
        }
        this.deleteCollection = this.deleteCollection.bind(this)
        this.createCollection = this.createCollection.bind(this)
        this.renameCollection = this.renameCollection.bind(this)
    }

    componentDidMount() {
        fetch(`http://localhost:3000/${this.props.db}/collections`)
        .then(resp => resp.json())
        .then(data => this.setState({collections : [...data]}))
    }

    deleteCollection(db, collection) {
        fetch('http://localhost:3000/collection', {
            method : 'DELETE',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({dbName : db, collection})
        })
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                let collections = [...this.state.collections]
                return collections.filter(name => name === collection ? 0 : 1)
            } else return 0
        })
        .then(data => {
            if(data) this.setState({collections : [...data]})
        })
    }

    createCollection() {
        let collection = document.querySelector('input[name="collectionName"]').value
        let db = this.props.db 
        fetch('http://localhost:3000/collection', {
            method : "POST",
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({dbName : db, collection})
        })
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                this.setState({
                    collections : [...this.state.collections, collection]
                })
            }
        })
    }

    renameCollection(collection) {
        let db = this.props.db 
        let newCol = document.querySelector('input[name="renameCollection"]').value
        fetch('http://localhost:3000/collection', {
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({dbName : db, collection, newCol})
        })
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                let collections = this.state.collections
                collections = collections.map(coll => coll === collection ? newCol : coll)
                this.setState({
                    collections : [...collections]
                })
            }
        })
    }
    
    render() {
        if(this.state.collections)
        return (
            <div id="collectionList">
                <div className="columns">
                    <div className="column is-2">
                        <div className="field">
                            <div className="control">
                                <input type="text" className="input" placeholder="Collection name" name="collectionName"/>
                            </div>
                        </div>
                    </div>
                    <div className="column is-1">
                    <div className="field">
                            <div className="control">
                                <button className="button is-success" onClick={this.createCollection}>Create Collection</button>
                            </div>
                        </div>
                    </div>
                </div>
                <table className="table is-hoverable">
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th>Collection Name</th>
                            <th>Select</th>
                            <th>Delete</th>
                            <th>Rename</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.collections.map((col, ind) => {
                            return (
                                <tr key={ind}>
                                    <th className="subtitle">{ind+1}</th>
                                    <td className="subtitle">{col}</td>
                                    <td><Link className="button is-info" to={`/collection/${this.props.db}/${col}`}>Select</Link></td>
                                    <td><button className="button is-danger" onClick={() => this.deleteCollection(`${this.props.db}`,`${col}`)}>Delete</button></td>
                                    <td>
                                        <div className="columns">
                                            <div className="column is-5">
                                                <input className="input" type="text"name="renameCollection"/>
                                            </div>
                                            <div className="column is-2">
                                                <button className="button" onClick={() => this.renameCollection(`${col}`)}>Rename</button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
        else 
            return (<Loader/>)
    }
}

export default Collections
