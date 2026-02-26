import Header from './Header'
import Footer from './Footer'
export default function Body({children}){
    return(
        <>
        <Header/>
        {children}
        <Footer/> 
        </>
    
    )
}