// import './style.css';

const Dashboard = () => {
    return (
        <>
            <section style={{marginTop: '50px'}}>
            <aside>
                <nav className="rad-sidebar">
                    <ul>
                        <li>
                            <a href="#" className="inbox">
                                <i className="fa fa-dashboard"><span className="icon-bg rad-bg-success"></span></i>
                                <span className="rad-sidebar-item">Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fa fa-bar-chart-o">
                                    <span className="icon-bg rad-bg-danger"></span>
                                </i>
                                <span className="rad-sidebar-item">Ticket status</span>
                            </a>
                        </li>
                        <li><a href="#" className="snooz"><i className="fa fa-line-chart"><span className="icon-bg rad-bg-primary"></span></i><span className="rad-sidebar-item">Call trends</span></a></li>
                        <li><a href="#" className="done"><i className="fa fa-area-chart"><span className="icon-bg rad-bg-warning"></span></i><span className="rad-sidebar-item">Heat maps</span></a></li>
                        <li><a href="#"><i className="fa fa-wrench"><span className="icon-bg rad-bg-violet"></span></i><span className="rad-sidebar-item">Settings</span></a></li>
                    </ul>
                </nav>
            </aside>
            <main>
                <section>
                    <div className="rad-body-wrapper">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-lg-4 col-md-12 col-xs-12">
                                    <div className="panel panel-default">
                                        <div className="panel-heading">
                                            <h3 className="panel-title">Area Chart</h3>
                                        </div>
                                        <div className="panel-body">
                                            <div id="areaChart" className="rad-chart"></div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-xs-12">
                                    <div className="panel panel-default">
                                        <div className="panel-heading">
                                            <h3 className="panel-title">Line Chart</h3>
                                        </div>
                                        <div className="panel-body">
                                            <div id="lineChart" className="rad-chart"></div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-xs-12">
                                    <div className="panel panel-default">
                                        <div className="panel-heading">
                                            <h3 className="panel-title">Donut Chart</h3>
                                        </div>
                                        <div className="panel-body">
                                            <div id="donutChart" className="rad-chart"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="panel panel-default">
                                        <div className="panel-heading">
                                            <h3 className="panel-title">Bar Chart</h3>
                                        </div>
                                        <div className="panel-body">
                                            <div id="barChart" className="rad-chart"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            </section>
        </>
    )
}

export default Dashboard