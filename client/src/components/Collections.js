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
    
    render() {
        if(this.state.collections)
        return (
            <div id="collectionList">
                <table className="table is-hoverable">
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th>Collection Name</th>
                            <th></th>
                            <th></th>
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
