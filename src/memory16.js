import React from 'react'

const styles = {
    buttonDiv: {
        marginLeft: "30px" 
    },
    button: { 
        textAlign: "center", 
        backgroundColor: "green", 
        color: "white", 
        paddingLeft: "20px", 
        paddingRight: "20px", 
        margin: "10px", 
        fontSize: "large"
    },
    divContainer: {
        width: "450px",
        marginLeft: "20px", 
        marginTop: "20px"
    },
    cards: {
        height: "120px", 
        width: "20%",
        border: "2px solid black", 
        float: "left", 
        margin: "3px", 
        padding: "3px"
    }
}

class Memory16 extends React.Component{
    constructor(props) {
        super(props) ;
        this.state = {
            colors: ["red","blue","green","yellow","lightblue","orange","gray","pink"],
            // colors: ["aqua","pink","orange","yellow"],
            cards: [],
            selected: [null,null],
            flip: false,
            fails: 0,
            gameOn: false,
            gameOver: false,
            count: 0,
            matches: 0,
            start: true,
            disableClick: [],
            // difficulty: [{level: 'EASY',attempts: 6}, {level: 'MEDIUM',attempts: 4} ,{level:'HARD',attempts:2}]
        }
        this.timer = "" ;

    }

    shuffleCards = () => {
        this.setState({gameOn: true, flip: false,gameOver: false,selected: [],fails: 0,matches: 0,disableClick: []}) ;
        let pairs = this.state.colors.concat(this.state.colors) ;
        let tcards = [] ;

        for(let i=pairs.length - 1 ; i>0 ; i--) {
            let j = Math.floor(Math.random() * (i + 1)) ;
            let temp = pairs[i] ;
            pairs[i] = pairs[j] ;
            pairs[j] = temp ;
        } 
        pairs.map((item,ind) => (tcards[ind] = {front : null, back : item}))
        console.log(tcards,'tcards')
        this.setState({ cards: tcards, start: false }) ;
        setTimeout(() => {
            this.setState({ flip: true })
        },500)
    }

    handleFlip = (id) => {
        if (this.state.disableClick.includes(id)) {
            return
        } else {
            console.log('Handle flip for id', id)
            let { cards } = this.state;

            let tArr = cards.map((item, ind) => {
                if (ind == id) {
                    let tmp = item.front;
                    item.front = item.back;
                    item.back = tmp;
                    return item;
                } else {
                    return item;
                }
            })

            this.setState({ cards: tArr, count: this.state.count + 1 }, () => {
                console.log("new card layout", cards);
                let tmp;
                if (this.state.count % 2 !== 0) {
                    tmp = [id, null];
                } else {
                    tmp = [this.state.selected[0], id]
                }
                this.setState({ selected: tmp }, () => {
                    console.log("cards and selected cards", cards, this.state.selected);

                    if (this.state.selected[0] !== null && this.state.selected[1] !== null) {
                        if (cards[this.state.selected[0]].front === cards[this.state.selected[1]].front) {
                            console.log('Cards match');
                            // do not flip
                            // disable onclick on div 
                            this.setState({ disableClick: [...this.state.disableClick,...this.state.selected] })

                            this.setState({ matches: this.state.matches + 1 }, () => {
                                console.log("Total Matching cards found: ", this.state.matches)

                                // check if game over by verifying match cards
                                if (this.state.matches == (this.state.cards.length / 2 - 1)) {
                                    //flip the last 2 cards and say game over 
                                    let finArr = this.state.cards.map((item,index) => {
                                        if(this.state.disableClick.includes(index)) {
                                            return item
                                        } else {
                                            let temp = item.front; 
                                            item.front = item.back ;
                                            item.back = temp ;
                                            return item ;
                                        }
                                    })
                                    console.log('final array',finArr) ;

                                    setTimeout(() => {
                                        this.setState({ cards : finArr}) 
                                    },300)
                                    setTimeout(() => {
                                        this.setState({ gameOver: true, gameOn: false, start: false })
                                    }, 1000)
                                }
                            })
                        } else {
                            console.log('Cards does not match');
                            // Flip the cards back and increase failcount ,add a timeout before flip back ?
                            let nArr = cards.map((item, ind) => {
                                if ((ind == this.state.selected[0]) || (ind == this.state.selected[1])) {
                                    let tmp = item.front;
                                    item.front = item.back;
                                    item.back = tmp;
                                    return item;
                                } else {
                                    return item;
                                }
                            })
                            console.log("After flip back", nArr)

                            setTimeout(() => {
                                this.setState({ cards: nArr, fails: this.state.fails + 1 }, () => {
                                    console.log("Cards after condition check and fail attempts", this.state.cards, this.state.fails)
                                })
                            }, 200)
                        }
                    }
                })
            })
        }
    }

    render() {
        console.log('state',this.state)
        return(
            <div>
                {this.state.start && <div style={styles.buttonDiv}><button style={styles.button} onClick={() => this.shuffleCards() }>Start</button></div>}

                <div style={styles.divContainer}>
                {this.state.gameOn && (
                    this.state.cards.map((item,ind) => {
                        let show = ""
                        if(!this.state.flip) {
                            show = item.back
                        } else {
                            show = item.front
                        }
                        return <div key={ind} style={{...styles.cards,backgroundColor:show}} onClick={() => this.handleFlip(ind)} ></div>
                    }))
                }</div>

                {this.state.gameOver && <div style={styles.buttonDiv}><h3>GAME OVER !!!</h3><h4>Total Mismatches : {this.state.fails}</h4>
                <button style={styles.button} onClick={() => this.shuffleCards()}>Play Again</button></div>}

            </div>
        )
    }
}

export default Memory16