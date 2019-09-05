import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import { bytesToKB } from '../utility/util'
import Loader from './Loader'

class Databases extends Component {

    constructor() {
        super();
        this.state = {
            list : null
        }
    }

    componentDidMount() {
        fetch('http://localhost:3000/databases')
        .then(response => response.json())
        .then(data => this.setState({list : [...data]}))
        .catch(error => this.setState({error : true}))
    }

    render() {
        if(this.state.list)
        return (
            <div id="databaseList">
                <table className="table is-fullwidth is-hoverable">
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th>Database Name</th>
                            <th>Size On Disk</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.list.map((object, ind) => {
                            return (
                                <tr key={ind}>
                                    <th>{ind+1}</th>
                                    <td>{object.name}</td>
                                    <td>{bytesToKB(object.sizeOnDisk)} KB</td>
                                    <td><Link to={`/${object.name}/collection`}>Select</Link></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
        else 
            return(<Loader/>)
    }
}

export default Databases
