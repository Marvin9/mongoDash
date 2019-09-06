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
        this.delete = this.delete.bind(this)
        this.createDatabase = this.createDatabase.bind(this)
    }

    componentDidMount() {
        fetch('http://localhost:3000/databases')
        .then(response => response.json())
        .then(data => this.setState({list : [...data]}))
        .catch(error => this.setState({error : true}))
    }

    delete(name) {
        fetch('http://localhost:3000/database', {
            method : 'DELETE',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({dbName : name + ''})
        })
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                let list = [...this.state.list]
                return list.filter(db => db.name === (name+'') ? 0 : 1)
            } else {
                return 0
            }
        })
        .then(data => {
            if(data) this.setState({list : [...data]})
        })
    }

    createDatabase() {
        let databaseName = document.querySelector('input[name="databaseName"]').value
        let object = { name : databaseName, sizeOnDisk : 0} 
        let list = [...this.state.list, object]
        this.setState({list : [...list]})
    }

    render() {
        if(this.state.list)
        return (
            <div id="databaseList">
                <div className="columns">
                    <div className="column is-2">
                        <div className="field">
                            <div className="control">
                                <input type="text" className="input" placeholder="Database name" name="databaseName"/>
                            </div>
                        </div>
                    </div>
                    <div className="column is-1">
                    <div className="field">
                            <div className="control">
                                <button className="button is-success" onClick={this.createDatabase}>Create Database</button>
                            </div>
                        </div>
                    </div>
                </div>
                <table className="table is-fullwidth is-hoverable">
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th>Database Name</th>
                            <th>Size On Disk</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.list.map((object, ind) => {
                            return (
                                <tr key={ind}>
                                    <th className="subtitle">{ind+1}</th>
                                    <td className="subtitle">{object.name}</td>
                                    <td className="subtitle">{bytesToKB(object.sizeOnDisk)} KB</td>
                                    <td><Link to={`/${object.name}/collection`} className="button is-info">Select</Link></td>
                                    {object.name === "admin" || object.name === "local" || object.name === "config" ? <td>Delete Process in Next Version</td> : 
                                    <td><button className="button is-danger" onClick={() => this.delete(object.name)}>Delete</button></td>}
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
