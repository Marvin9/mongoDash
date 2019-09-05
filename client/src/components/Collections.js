import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Loader from './Loader'

class Collections extends Component {

    constructor() {
        super();
        this.state = {
            collections : null
        }
    }

    componentDidMount() {
        fetch(`http://localhost:3000/${this.props.db}/collections`)
        .then(resp => resp.json())
        .then(data => this.setState({collections : [...data]}))
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
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.collections.map((col, ind) => {
                            return (
                                <tr key={ind}>
                                    <th>{ind+1}</th>
                                    <td>{col}</td>
                                    <td><Link to={`/collection/${this.props.db}/${col}`}>Select</Link></td>
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
