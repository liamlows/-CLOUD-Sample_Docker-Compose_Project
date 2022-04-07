import './HomePage.css';

export const HomePage = () => {

    return <div className="container mt-4">
        <h1 className="header-align-center">Discover, collect, and sell extra ordinary NFTs</h1>
            <div className="container mt-4 d-flex">
                <div className="card mt-4s" onClick={()=>alert("Go to product detail")}>
                    <img className="card-img-top" src="	https://5.imimg.com/data5/GV/NJ/MY-20565232/modern-art-paintings-250x250.jpg"></img>
                        <div className="card-body">
                            <h5 className="card-title">Art title</h5>
                            <p className="card-text">Author</p>
                            <p className="card-text">Desciption</p>
                            <p className="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
                        </div>
                </div>
                <div class="card" onClick={()=>alert("Go to product detail")}>
                    <img className="card-img-top" src="https://www.absolutearts.com/contemporary_original_artworks/paintings/3_400.jpg" alt="Card image cap"></img>
                        <div className="card-body">
                            <h5 className="card-title">Card title</h5>
                            <p className="card-text">2</p>
                            <p className="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
                        </div>
                </div>
                <div className="card" onClick={()=>alert("Go to product detail")}>
                    <img className="card-img-top" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/298ac3e9-c643-4a3c-b3f4-a15b427fb7ea/df0bj0k-633cee00-8794-4b29-8889-facb2818a2f4.jpg/v1/fill/w_250,h_250,q_70,strp/sunset_by_ahmediztiaq_df0bj0k-250t.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTA4MCIsInBhdGgiOiJcL2ZcLzI5OGFjM2U5LWM2NDMtNGEzYy1iM2Y0LWExNWI0MjdmYjdlYVwvZGYwYmoway02MzNjZWUwMC04Nzk0LTRiMjktODg4OS1mYWNiMjgxOGEyZjQuanBnIiwid2lkdGgiOiI8PTEwODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.Zr2cymhqfdxtsbfwbYcxol8SI30DalQjRgaeSJYcrLg" alt="Card image cap"></img>
                        <div className="card-body">
                            <h5 className="card-title">Card title</h5>
                            <p className="card-text">1</p>
                            <p className="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
                        </div>
                </div>
            </div>
        
    </div>

}