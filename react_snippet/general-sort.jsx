import React from "react";
import {Card, Form} from "react-bootstrap";
import PropTypes from 'prop-types';
import axios from "axios";
import * as ReactGA from "react-ga";

class GeneralSort extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            makes: []
        };

        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleMakeChange = this.handleMakeChange.bind(this);
        this.handleMinPriceChange = this.handleMinPriceChange.bind(this);
        this.handleMaxPriceChange = this.handleMaxPriceChange.bind(this);
        this.handleMinYearChange = this.handleMinYearChange.bind(this);
        this.handleMaxYearChange = this.handleMaxYearChange.bind(this);
        this.handleDealChange = this.handleDealChange.bind(this);
    }

    componentDidMount() {
        const self = this;
        const start = performance.now();
        axios.all([
            axios.get(`${process.env.BASE_URL}/api/category`),
            axios.get(`${process.env.BASE_URL}/api/make/in-stock`)
        ])
        .then(axios.spread(function (categoryResponse, makeResponse) {
            self.setState(prevState => ({
                categories: [...prevState.categories, ...categoryResponse.data],
                makes: [...prevState.makes, ...makeResponse.data]
            }));
            const end = performance.now();
            ReactGA.timing({
                category: 'JS Libraries',
                variable: 'dropdowns',
                value: end - start,
                label: 'Make and Category query'
            });
        }));
    }

    handleCategoryChange(e) {
        this.props.onCategoryChange(e.target.value);
    }

    handleMakeChange(e) {
        this.props.onMakeChange(e.target.value);
    }

    handleMinPriceChange(e) {
        this.props.onMinPriceChange(e.target.value);
    }

    handleMaxPriceChange(e) {
        this.props.onMaxPriceChange(e.target.value);
    }

    handleMinYearChange(e) {
        this.props.onMinYearChange(e.target.value);
    }

    handleMaxYearChange(e) {
        this.props.onMaxYearChange(e.target.value);
    }

    handleDealChange(e) {
        this.props.onDealChange(e.target.checked);
    }

    render() {
        const categoryItems = this.state.categories.map((category) =>
            <option key={category.id} value={category.category}>{category.category}</option>
        );
        const makeItems = this.state.makes.map((make) =>
            <option key={make.id} value={make.make}>{make.make}</option>
        );
        const defaultCategory = this.props.defaultCategory.charAt(0).toUpperCase() + this.props.defaultCategory.slice(1).toLowerCase();

        return (
            <Card>
                <Card.Body>
                    <Form>
                        <Form.Group controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select" value={defaultCategory} onChange={this.handleCategoryChange}>
                                <option value=''>Choose...</option>
                                {categoryItems}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="make">
                            <Form.Label>Make</Form.Label>
                            <Form.Control as="select" value={this.props.defaultMake} onChange={this.handleMakeChange}>
                                <option value=''>Choose...</option>
                                {makeItems}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="minPrice">
                            <Form.Label>Min Price</Form.Label>
                            <Form.Control type="number" placeholder="Low" value={this.props.defaultMinPrice} onChange={this.handleMinPriceChange} />
                        </Form.Group>
                        <Form.Group controlId="maxPrice">
                            <Form.Label>Max Price</Form.Label>
                            <Form.Control type="number" placeholder="High" value={this.props.defaultMaxPrice} onChange={this.handleMaxPriceChange} />
                        </Form.Group>
                        <Form.Group controlId="minYear">
                            <Form.Label>Min Year</Form.Label>
                            <Form.Control type="number" placeholder="Low" value={this.props.defaultMinYear} onChange={this.handleMinYearChange} />
                        </Form.Group>
                        <Form.Group controlId="maxYear">
                            <Form.Label>Max Year</Form.Label>
                            <Form.Control type="number" placeholder="High" value={this.props.defaultMaxYear} onChange={this.handleMaxYearChange} />
                        </Form.Group>
                        <Form.Group controlId="special">
                            <Form.Check type="checkbox" label="Specials" checked={this.props.defaultDeal} onChange={this.handleDealChange} />
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        );
    }
}

GeneralSort.propTypes = {
    onCategoryChange: PropTypes.func.isRequired,
    onMakeChange: PropTypes.func.isRequired,
    onMinPriceChange: PropTypes.func.isRequired,
    onMaxPriceChange: PropTypes.func.isRequired,
    onMinYearChange: PropTypes.func.isRequired,
    onMaxYearChange: PropTypes.func.isRequired,
    onDealChange: PropTypes.func.isRequired,
    defaultCategory: PropTypes.string.isRequired,
    defaultMake: PropTypes.string.isRequired,
    defaultMinPrice: PropTypes.string.isRequired,
    defaultMaxPrice: PropTypes.string.isRequired,
    defaultMinYear: PropTypes.string.isRequired,
    defaultMaxYear: PropTypes.string.isRequired,
    defaultDeal: PropTypes.bool.isRequired
};

export default GeneralSort;