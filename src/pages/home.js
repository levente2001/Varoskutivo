import React from "react";
import { Redirect } from "react-router-dom";
//import ReactModal from 'react-modal';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { authStates, withAuth } from "../components/auth";
import Firebase from "firebase";
import { signOut, initialize } from "../utils/firebase";
import Loader from "../components/loader";
import logo from '../varoskutlogo.png';
import emailjs from '@emailjs/browser';

function handleSignOut() {
  signOut()
    .then(() => {
      console.log("Signed Out");
    })
    .catch(e => {
      console.log("Error signing out", e);
    });
}




class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value: '',
      cimnev: '',
      vendeg: '',
      tetel: '',
      modcat: '',
      price: [],
      ar: '',
      id: '',
      idt: '',
      rev: [],
      items: [],
      termekek: [],
      lista: [],
      nevek: [],
      ter: 0,
      zero: 0,
      bevtl: [],
      user: '',
      szamlalo: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitTerm = this.handleSubmitTerm.bind(this);
    this.handleSubmitFiz = this.handleSubmitFiz.bind(this);
    this.handleSubmitTetelTorles = this.handleSubmitTetelTorles.bind(this);
    this.handleZaras = this.handleZaras.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }
  
  handleZaras(e) {
    e.preventDefault();
    initialize();
    const itemsRef = Firebase.database().ref('rev');
    itemsRef.remove();
    let numbers = this.state.lista
    let result = numbers.filter(item => item.vendeg)
    var templateParams = {
      to_name: "Rebeka",
      from_name1: "Pöpi",
      message1: "Forró csoki, espresso, tej 1 dl",
      from_name2: "Levi",
      message2: "Whiskey cola, GinTonic, Coca-cola",
      from_name3: "Zoli",
      message3: "Ásványvíz, tej, sör",
      from_name4: "Péter",
      message4: "Lottó, tej, bubisvíz",
      
    };
    console.log(result)
    emailjs.send('service_gbavh8e', 'template_gnhu46w', templateParams, 'XThjOXCqFi54k7hk-')
      .then(function(response) {
         console.log('SUCCESS!', response.status, response.text);
      }, function(error) {
         console.log('FAILED...', error);
      });
  }

  sendEmail(e){
    e.preventDefault();
    let numbers = this.state.lista
    let result = numbers.filter(item => item.vendeg)
    console.log(result)
    emailjs.sendForm('service_gbavh8e', 'template_gnhu46w', {message_html: result, from_name: "VárosKútIvó Zárás"}, 'XThjOXCqFi54k7hk-')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
  };

  

  handleSubmit(e) {
    e.preventDefault();
    initialize();
    const itemsRef = Firebase.database().ref('items');
    const item = {
      user: this.state.value
    }
    itemsRef.push(item);
    this.setState({
      value: '',
    });
  }

  handleSubmitFiz(e) {
    e.preventDefault();
    initialize();
    const itemsRef = Firebase.database().ref('items/' + this.state.id);
    const itemsRefP = Firebase.database().ref('tetelek/');
    const itemsRefR = Firebase.database().ref('rev');
    let numbers = this.state.lista;
    let result = numbers.filter(item => item.vendeg === this.state.cimnev).reduce((total, currentValue) => total = total + currentValue.ar,0);
    itemsRefR.push({
      vegosszeg: result
    })
    itemsRef.remove()
    itemsRefP.on('value', (snapshot) => {
      let items = snapshot.val();
      for (let item in items) {
        if(items[item].vendeg === this.state.cimnev){
          let id = item
          const delet = Firebase.database().ref('tetelek/' + id)
          delet.remove()
        }
      }
    });
    this.setState({openModallll: true})
    window.location.reload(false)
    /*this.setState({
      cimnev: '',
    })*/
  }

  handleSubmitTetelTorles(e) {
    e.preventDefault();
    initialize();
    const itemsRef = Firebase.database().ref('tetelek/' + this.state.idt);
    itemsRef.remove()
    this.setState({
      openModalll: false
    })
  }

  handleSubmitTerm(e) {
    e.preventDefault();
    initialize();
    const itemsReff = Firebase.database().ref('tetelek');
    const itemm = {
      vendeg: this.state.cimnev,
      tetel: this.state.tetel,
      ar: this.state.ar,
      szamlalo: this.state.szamlalo,
    }
    itemsReff.push(itemm);
    this.setState({
      vendeg: '',
      tetel: '',
      ar: '',
      szamlalo: ''
    });
  }

  onClickButton = e =>{
    e.preventDefault()
    this.setState({openModal : true})
}

onClickButtonnn = e =>{
  e.preventDefault()
  this.setState({openModalll : true})
}
onClickButtonnnn = e =>{
  e.preventDefault()
  this.setState({openModallll : true})
}

onClickBbuttonnnn = e =>{
  e.preventDefault()
  this.setState({openModalllll : true})
}

onCloseModal = ()=>{
  this.setState({openModal : false})
}
onCloseModalll = ()=>{
  this.setState({openModalll : false})
}
onCloseModallll = ()=>{
  this.setState({openModallll : false})
}
onCloseMmodallll = ()=>{
  this.setState({openModalllll : false})
}

componentDidMount() {
  initialize();
  Firebase.auth().onAuthStateChanged(function(user) {
    switch (user.email) {
      case 'lalivaroskut@gmail.com' :
        console.log("Lali");
        break;
      case 'zsuzsavaroskut@gmail.com' :
        console.log("Zsuzsa");
        break;
      case 'kalolevente@gmail.com' :
        console.log("Levi");
        break;
      case 'rebekavaroskut@gmail.com' :
        console.log("Rebeka");
        break;
      case 'kbela0990@gmail.com' :
        console.log("TestName");
        break;
      default: 
        console.log("Sorry nobody is logged in!")
    }
});
  const itemsRef = Firebase.database().ref('items');
  const itemsRefT = Firebase.database().ref('products');
  const itemsRefR = Firebase.database().ref('rev');
  const itemsRefP = Firebase.database().ref('tetelek');
  itemsRefR.on('value', (snapshot) => {
    let items = snapshot.val();
    let ossz = [];
      for (let item in items) {
        ossz.push({
          ossz: items[item].vegosszeg
        });
      }
    
    this.setState({bevtl: ossz});
  });
  itemsRef.on('value', (snapshot) => {
    let items = snapshot.val();
    let newState = [];
    for (let item in items) {
      newState.push({
        id: item,
        user: items[item].user
      });
    }
    this.setState({
      items: newState
    });
  });
  itemsRefT.on('value', (snapshot) => {
    let items = snapshot.val();
    let newState = [];
    for (let item in items) {
      newState.push({
        id: item,
        cat: items[item].cat,
        ar: items[item].ar,
        nev: items[item].nev
      });
    }
    this.setState({
      termekek: newState
    });
  });
  itemsRefP.on('value', (snapshot) => {
    let items = snapshot.val();
    let newState = [];
    for (let item in items) {
      newState.push({
        id: item,
        ar: items[item].ar,
        tetel: items[item].tetel,
        vendeg: items[item].vendeg,
        szamlalo: items[item].szamlalo,
      });
      this.setState({
        lista: newState
      });
    }
  });
}


  render() {
    if (this.props.authState === authStates.INITIAL_VALUE) {
      return <Loader />;
    }

    if (this.props.authState === authStates.LOGGED_OUT) {
      return <Redirect to="/login"></Redirect>;
    }
    let numbers = this.state.lista;
    let result = numbers.filter(item => item.vendeg === this.state.cimnev).reduce((total, currentValue) => total = total + currentValue.ar * currentValue.szamlalo,0);           
    let bevtl = this.state.bevtl;
    let resultt = bevtl.reduce((total, currentValue) => total = total + currentValue.ossz,0);
  
    return (
      <div className="container">
        
        
        <div className="helo">

          <div className="feherablak3">
            <p>{resultt} Ft</p>

          </div>

          <div className="feherablak2">
          <img src={logo}  alt="logo" className="img"></img>
          </div>

          <div className="feherablak">
            <h2>{this.state.user}</h2>
            <div className="inner">
              <button className="buttonr" onClick={handleSignOut}> Kijelentkezés </button>
              {/*<button className="button" onClick={this.handleZaras}> ZÁRÁS </button>*/}
            </div>
            {/*<div className="inner">
            <Link to="/admin">Admin</Link>
            </div>*/}
          </div>

          
        </div>

        <div className="feherablak4">
          <div className="feherablak5">

            <h2>Vendéglista</h2>

            <form onSubmit={this.handleSubmit}>
              <label>
                <input type="text" value={this.state.value} placeholder="Vendég neve" onChange={this.handleChange} />
              </label>
              <input className="ipuntplus" type="submit" value="+" />
            </form>
            

            <ul className="nevek">
              {this.state.items.map((item) => {
                return (
                  <li className="nevekli" onClick={() => {this.setState({cimnev: item.user}); this.setState({ter: result}); this.setState({id: item.id})}} key={item.id}>
                    {item.user}
                  </li>
                )
              })}
            </ul>

          </div>

          
          <div className="feherablak6">
            <div className="profil">
              <div className="nev">
                <h2>{this.state.cimnev}</h2>
                
              </div>
              <div className="plus">
                <button onClick={this.onClickButton} className="buttonprof"> + </button>
                <Modal open={this.state.openModal} onClose={this.onCloseModal}>
                 <div className="modd">
                 <div className="szuro">
                   <button className="modalhozz" onClick={() => {this.setState({modcat: "meleg"})}}>Meleg italok</button>
                   <button className="modalhozz" onClick={() => {this.setState({modcat: "üdítők"})}}>Üdítők</button>
                   <button className="modalhozz" onClick={() => {this.setState({modcat: "borok"})}}>Borok</button>
                   <button className="modalhozz" onClick={() => {this.setState({modcat: "koktel"})}}>Koktélok</button>
                   <button className="modalhozz" onClick={() => {this.setState({modcat: "rovid2"})}}>Rövid 2cl</button>
                   <button className="modalhozz" onClick={() => {this.setState({modcat: "rovid4"})}}>Rövid 4cl</button>
                   <button className="modalhozz" onClick={() => {this.setState({modcat: "sör"})}}>Sör</button>
                   <button className="modalhozz" onClick={() => {this.setState({modcat: "snack"})}}>Snackek</button>
                   <button className="modalhozz" onClick={() => {this.setState({modcat: "jeges italok"})}}>Jeges italok </button>
                 </div>

                 <ul className="termlist">
                   {this.state.termekek.filter(item => item.cat === this.state.modcat).map((item) => {
                     return (
                       <li className="nevekli" onClick={() => {this.setState({szamlalo: 1});this.setState({ar: item.ar}); this.setState({tetel: item.nev})}} key={item.id}>
                         <h4>{item.nev}</h4>
                         <h3>{item.ar} Ft</h3>
                         
                       {/*enis.can.write=prg'name'*/}
                       </li>
                     )
                   })}
                 </ul>

                 </div>

                 
                <button className="modalhozz" onClick={this.handleSubmitTerm}>Hozzáad</button>
                </Modal>
              </div>
              <div className="fizetes">
              <Modal open={this.state.openModalllll} onClose={this.onCloseMmodallll}>
                <h6>BIZTOSAN FIZET?</h6>
                <button className="modalhozz" onClick={this.handleSubmitFiz}>FIZET</button>
                <button className="buttonr" onClick={this.onCloseMmodallll}>MÉGSE</button>
                </Modal>
                <button className="buttonfiz" onClick={this.onClickBbuttonnnn}> Fizetés </button>
              </div>

            </div>

            <div className="fizetendo">
            
              Fizetendő: {result} Ft
            </div>

            <ul className="cucclist">
                          {this.state.lista.filter(item => item.vendeg === this.state.cimnev).map((item) => {
                           let szamlalo = item.szamlalo;
                           const itemsRefs = Firebase.database().ref('tetelek/' + item.id);
                           return (
                              <li  key={item.id}>
                                <div className="tetelelista">
                                  <div className="szamlalo">{item.ar * szamlalo} Ft</div>
                                  <div className="cucclihozz">{item.tetel}</div>
                                  <div className="szamlalop" onClick={() => {itemsRefs.update({szamlalo: szamlalo++})}}>+</div>
                                  <div className="szamlalom" onClick={() => {itemsRefs.update({szamlalo: szamlalo--})}}>-</div>
                                  <div className="szamlalok" onClick={() => {this.setState({openModalll: true}); this.setState({idt: item.id})}}>törlés</div>
                                </div>
                              </li>
                            )
                          })}
                        </ul>
                        <Modal open={this.state.openModalll} onClose={this.onCloseModalll}>
                                    <h6>BIZTOSAN TÖRÖLNI AKAROD EZT A TÉTELT?</h6>
                                    <button className="modalhozz" onClick={this.handleSubmitTetelTorles}>TÖRLÉS</button>
                        </Modal>
          </div>
        </div>
      </div>
    );
  }
   
}

export default withAuth(Home);