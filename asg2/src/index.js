/* 
    I declare that the lab work here submitted is original except for source material explicitly acknowledged, 
    and that the same or closely related material has not been previously submitted for another course. 
    I also acknowledge that I am aware of University policy and regulations on honesty in academic work, 
    and of the disciplinary guidelines and procedures applicable to breaches of such policy and regulations, 
    as contained in the website. University Guideline on Academic Honesty: https://www.cuhk.edu.hk/policy/academichonesty/ 

    Student Name : YUAN Lin 
    Student ID : 1155141399 
    Class/Section : CSCI2720 
    Date : Nov 15, 2023 
*/

import ReactDOM from "react-dom/client";
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom';



class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <ul>
            <li> <Link to="/">Home</Link> </li>
            <li> <Link to="/gallery">Gallery</Link> </li>
            <li> <Link to="/slideshow">Slideshow</Link> </li>
          </ul>
        </div>

        <hr />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery name="CUHK pictures"/>} />
          <Route path="/slideshow" element={<Slideshow/>} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

class Home extends React.Component {
  render() {
    return (
    <><h2>Home</h2>
    <img src={"componentPlot.png"} className="w-100" />
    </>


    )
  }
}

class Gallery extends React.Component {
  render(){
    return(
        <>
            <Title name={this.props.name}/>
            <Gallerylab5 />
        </>
    )
}
}

class Slideshow extends React.Component {
  
  //constructor
  constructor(props) {
    super(props);
    this.state = {
      currentImageID: 0,
      currentInterval: 1500,
      currentPlayingStatus: false,  // default: not on-going for slideshow

      slideShowImages: [
        {filename: "cuhk-2013.jpg", year:2013, remarks: "Sunset over CUHK"}, 
        {filename: "cuhk-2017.jpg", year:2017, remarks: "Bird's-eye view of CUHK"},
        {filename: "sci-2013.jpg", year:2013, remarks: "The CUHK Emblem"}, 
        {filename: "shb-2013.jpg", year:2013, remarks: "The Engineering Buildings"},
        {filename: "stream-2009.jpg", year:2009, remarks: "Nature hidden in the campus"},
        ],
    }
  }
  

  
  //functions

  start(){
    if(this.state.currentPlayingStatus==false){
      this.setState({currentPlayingStatus: true}); // change the status
      this.intervalId = setInterval(() => this.nextslide(), this.state.currentInterval);  // setup the slideshow and interval
        }    
  }
  

  stop(){
    if(this.state.currentPlayingStatus==true){ // guarantee that there is already an intervalID get setup
      clearInterval(this.intervalId) // clear the interval
      this.setState({currentPlayingStatus: false});      // change the status


      
    }

  }

  nextslide(){
    this.setState({currentImageID: (this.state.currentImageID+1) % 5}); // 5 images, so mod 5    
  }

  slow(){
    if(this.state.currentPlayingStatus==true){ // guarantee that there is already an intervalID get setup
    clearInterval(this.intervalId); // clear the interval
    //    this.setState({currentInterval: (preinterval+200)});
    //    this.intervalId = setInterval(() => this.nextslide(), this.state.currentInterval);
    this.setState({ currentInterval: (this.state.currentInterval + 200) }, () => {this.intervalId = setInterval(() => this.nextslide(), this.state.currentInterval)});

  }

    
    }



  fast(){
  if(this.state.currentPlayingStatus==true){    
    if(this.state.currentInterval>=400){ // to prevent interval<=200 after decreasing
      clearInterval(this.intervalId);
      //  this.setState({currentInterval: (preinterval-200)});
      //  this.intervalId = setInterval(() => this.nextslide(), this.state.currentInterval);
      this.setState({ currentInterval: (this.state.currentInterval - 200) }, () => {this.intervalId = setInterval(() => this.nextslide(), this.state.currentInterval)});
      
    }
  }    
    
    


  }

  shuffle(){
    // referenc: Fisher-Yates shuffle algorithm
    let array = this.state.slideShowImages;
    for(let x = array.length-1; x > 0; x--){
      let y=Math.floor(Math.random()*(x+1));
      [array[x], array[y]] = [array[y], array[x]];
    }
    this.setState({slideShowImages: array});
  }



 

 
  
    
  //render

  render() {
    let currentImage =  this.state.slideShowImages[this.state.currentImageID];

    return (
      <main className="container">
      <div>
        <div>
          <button onClick={()=>this.start()}>Start slideshow</button>
          <button onClick={()=>this.stop()}>Stop slideshow</button>
          <button onClick={()=>this.slow()}>Slower</button>
          <button onClick={()=>this.fast()}>Faster</button>
          <button onClick={()=>this.shuffle()}>Shuffle</button>
        </div>
        <div>
          <img src={"images/" + currentImage.filename} />
          <p>{currentImage.filename}</p>
        </div>
        <div>
          <p>Running Status: {this.state.currentPlayingStatus ? "Yes" : "No"}</p>
        </div>
      </div>
      </main>
    );
  }
  

  
}



class NoMatch extends React.Component {
  render() {
    return <h2>No match</h2>;
  }
}










// Modifed from Lab 5 code
// Credit: CSCI2720 Dr. Colin and TA

const data = [
  {filename: "cuhk-2013.jpg", year:2013, remarks: "Sunset over CUHK"}, 
  {filename: "cuhk-2017.jpg", year:2017, remarks: "Bird's-eye view of CUHK"},
  {filename: "sci-2013.jpg", year:2013, remarks: "The CUHK Emblem"}, 
  {filename: "shb-2013.jpg", year:2013, remarks: "The Engineering Buildings"},
  {filename: "stream-2009.jpg", year:2009, remarks: "Nature hidden in the campus"},
  ];



class Title extends React.Component {
  render() {
      return (
          <header className="bg-warning">
              <h1 className="display-4 text-center">{this.props.name}</h1>
          </header>
      );
  }
}

class Gallerylab5 extends React.Component {
  render() {
      return (
          <main className="container">
              {data.map((file,index) => <FileCard i={index} key={index}/>)}
          </main>
      );
  }
}

class FileCard extends React.Component {
  
  constructor(props) {
      super(props);
      this.state = { Hovered: false };
      }
  
  mouseHere(){
    this.setState({Hovered: true})
  }

  mouseAway(){
    this.setState({Hovered: false})
  }

  render() {
      let i = this.props.i;
      return (
              <div className="card d-inline-block m-2" style={{width:this.state.Hovered===true ? 400 : 200}} onMouseEnter={()=>this.mouseHere()} onMouseLeave={()=>this.mouseAway()}>
                  <img src={"images/"+data[i].filename} className="w-100" />
                  <div className="card-body">
                      <h6 className="card-title">{data[i].filename}</h6>
                      <p className="card-text">{data[i].year}</p>
                  </div>
              </div>
      );
  }
}



const root = ReactDOM.createRoot(document.querySelector('#app'));
root.render(<App />);