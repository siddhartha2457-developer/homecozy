import React from 'react'
import Navbar from '../Components/Navbar'
import CategoryFilter from '../Components/CategoryFilter'
import Detailcard from '../Components/Detailcard'
import Footer from '../Components/Footer'
import SearchBar from '../Components/SearchBar'
import MapComponent from '../Components/list/MapComponent'
import PropertyType  from '../Components/list/PropertyTypeSelector'
// import PropertyMap  from '../Components/PropertyMap'
import Search from  '../Components/Search';



const locations = [
  { latitude: 34.0837, longitude: 74.7973, title: 'Srinagar Villa' },
  
];

const Detailedpage = () => {
  return (
    <div>
        <Navbar> </Navbar>
        <Search></Search>
          {/* <SearchBar></SearchBar>
        <CategoryFilter></CategoryFilter>
        <PropertyType></PropertyType>
        <div style={{ display: 'flex', justifyContent: 'space-around' , margin:'10px'}}>

          <MapComponent 
        markers={[
          { latitude: 34.0837, longitude: 74.7973, title: 'Villa 1', description: 'Beautiful villa in Srinagar' },
          { latitude: 34.1389, longitude: 74.8372, title: 'Villa 2', description: 'Luxury villa near Dal Lake' },
          { latitude: 33.7782, longitude: 75.6227, title: 'Villa 3', description: 'Cozy villa in Pahalgam' }
        ]}
        zoom={13}
        height="90vh"
        width="400px"
      />
        <Detailcard></Detailcard>
        </div> */}
        <Footer></Footer>
        
    </div>
  )
}

export default Detailedpage;