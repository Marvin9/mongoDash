import React, { Component } from 'react'
import Loader from './Loader'

class Collection extends Component {
    constructor() {
        super()
        this.state = {
            tuples : null
        }
    }

    componentDidMount() {
        fetch('http://localhost:3000/collection?db='+this.props.db+'&collection=' + this.props.collection)
        .then(res => res.json())
        .then(data => this.setState({ tuples : [...data]}))
    }

    render() {
        if(this.state.tuples)
        return (
            <div id="tuples">
                {this.state.tuples.map((obj, ind) => {
                    return (
                        <div className="box" key={ind}>
                            {Object.keys(obj).map(key => {
                                return(<h1>{key} : {typeof obj[key] === "string" ? '"'+obj[key]+'"' : obj[key]}</h1>)
                            })}
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
