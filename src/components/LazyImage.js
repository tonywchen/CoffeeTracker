import React from 'react';

const options = {
    rootMargin: '0px',
    threshold: 1.0
};

class LazyImage extends React.Component {
    constructor() {
        super();
        this.image = React.createRef();
    }

    state = {
        loaded: false
    };

    componentDidMount() {
        if (this.props.eager) {
            this.setState({ loaded: true });
        } else {
            this.observer = new IntersectionObserver((entries) => {
                for (let entry of entries) {
                    if (entry.isIntersecting) {
                        this.setState({ loaded: true });
                        this.observer.unobserve(this.image.current);
                    }
                }
            }, options);
    
            this.observer.observe(this.image.current);
        }
    }

    componentWillUnmount() {
        if (this.observer) {
            this.observer.unobserve(this.image.current);
        }
    }


    render() {
        let src = (this.state.loaded)
            ? this.props.src
            : null;

        return (
            <img
                ref={this.image}
                className={this.props.className}
                alt={this.props.alt}
                src={src}
            />
        );
    }
}

export default LazyImage;