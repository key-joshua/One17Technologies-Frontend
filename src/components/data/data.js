/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import axios from 'axios';
import Helmet from 'react-helmet';
import React, { Component } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faSearch, faAngleLeft, faAngleRight, faSyncAlt, faTrashAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import Loading from '../loading/loading';
import { apiList, variables, shortData } from '../../helpers';

const successTimeOut = variables.SUCCESS_TIMEOUT;
const errorTimeOut = variables.SUCCUSS_TIMEOUT;
let pushedData = [];
class Data extends Component {
  constructor() {
    super();
    this.state = {
      id: null,
      result: false,
      buttonStatus: '',
      showAddForm: false,

      data: [],
      dataLoaded: false,

      searchedData: [],
      searchedDataLoaded: false,

      currentPage: 1,
      postPerPage: 2,
      pageCount: null,

      keyword: '',
      name: '',
      phone: '',
      dob: '',
    };
  }

  componentDidMount() {
    const { postPerPage } = this.state;
    this.setState({ result: true, data: [], dataLoaded: false, searchedData: [], searchedDataLoaded: false, keyword: '' });

    axios.get(`${apiList.VIEW_USER_API}`)
      .then((response) => {
        this.setState({
          data: [...response.data.data.paginate],
          dataLoaded: true,
          pageCount: Math.ceil(response.data.data.paginate.length / postPerPage)
        });

        setTimeout(() => { this.setState({ result: false }); }, successTimeOut);
      })
      .catch((error) => {
        toast.error(`${error.response.data.error || error.response.data.message}`);
        setTimeout(() => {
          this.setState({ result: false });
        }, errorTimeOut);
      });
  }

  handlePreviouPage(key, page) {
    key.preventDefault();
    this.setState({ result: true, keyword: '', currentPage: page, searchedData: [], searchedDataLoaded: false });

    setTimeout(() => {
      this.setState({ result: false });
    }, successTimeOut);
  }

  handleNextPage(key, page) {
    key.preventDefault();
    this.setState({ result: true, keyword: '', currentPage: page, searchedData: [], searchedDataLoaded: false });

    setTimeout(() => {
      this.setState({ result: false });
    }, successTimeOut);
  }

  handleSearchBook(key) {
    key.preventDefault();
    const newData = [];
    const { keyword } = this.state;

    if (keyword.length < 1) {
      toast.error('Search keyword is required');
      return;
    }

    const filter = keyword.toLowerCase();
    this.setState({ result: true, searchedData: [], searchedDataLoaded: false });

    pushedData.find((element) => {
      if (element.name.toLowerCase().indexOf(filter) > -1) {
        newData.push(element);
        this.setState({ searchedData: [...newData], searchedDataLoaded: true });

        setTimeout(() => {
          this.setState({ result: false });
        }, successTimeOut);
      }
    });

    if (!pushedData.find((element) => element.name.toLowerCase().indexOf(filter) > -1)) {
      toast.error('Matching results not found');
      setTimeout(() => {
        this.setState({ result: false });
      }, errorTimeOut);
    }
  }

  handleShowAddForm(key, status, id) {
    key.preventDefault();
    const { showAddForm, data } = this.state;

    if (status === 'edit') {
      this.setState({ id });
      const filteredData = data.find((element) => element.id === Number(id));
      this.setState({ name: filteredData.name, phone: filteredData.phone, dob: filteredData.dob });
    }

    if (showAddForm === true) {
      this.setState({ showAddForm: false, buttonStatus: '' });
    }

    if (showAddForm === false) {
      this.setState({ showAddForm: true, buttonStatus: status });
    }
  }

  handleHideAddForm(key) {
    key.preventDefault();
    this.setState({
      showAddForm: false,
      buttonStatus: '',
      result: false,
      name: '',
      phone: '',
      dob: ''
    });
  }

  handleChange(key) {
    key.preventDefault();
    this.setState({ [key.target.id]: key.target.value });
  }

  handleDeleteData(key, id) {
    key.preventDefault();
    const { postPerPage } = this.state;

    if (confirm('CONFIRM TO PROCCESSED )): Your data will lost, if you press OK')) {
      this.setState({ result: true });
      axios.delete(`${apiList.DELETE_USER_API}/${id}`)
        .then((response) => {
          this.setState({
            data: [...response.data.data],
            dataLoaded: true,
            pageCount: Math.ceil(response.data.data.length / postPerPage)
          });

          toast.success(response.data.message);
          setTimeout(() => { this.setState({ currentPage: 1, result: false }); }, successTimeOut);
        })
        .catch((error) => {
          toast.error(`${error.response.data.error || error.response.data.message}`);
          setTimeout(() => {
            this.setState({ result: false });
          }, errorTimeOut);
        });
    } else {
      this.setState({ result: false });
    }
  }

  handleEditData(key) {
    key.preventDefault();
    const { id, name, phone, dob, postPerPage } = this.state;

    if (name.length < 1 || phone.length < 1 || dob.length < 1) {
      toast.error('All form fields is required');
      return;
    }

    this.setState({ result: true, showAddForm: false, searchedData: [], searchedDataLoaded: false });
    axios.patch(`${apiList.UPDATE_USER_API}/${id}`, { name, phone, dob })
      .then((response) => {
        this.setState({
          data: [...response.data.data],
          dataLoaded: true,
          pageCount: Math.ceil(response.data.data.length / postPerPage)
        });

        toast.success(response.data.message);
        setTimeout(() => { this.setState({ currentPage: 1, result: false }); }, successTimeOut);
      })
      .catch((error) => {
        toast.error(`${error.response.data.error || error.response.data.message}`);
        setTimeout(() => {
          this.setState({ result: false });
        }, errorTimeOut);
      });
  }

  handleSaveData(key) {
    key.preventDefault();
    const { name, phone, dob, postPerPage } = this.state;

    if (name.length < 1 || phone.length < 1 || dob.length < 1) {
      toast.error('All form fields is required');
      return;
    }

    this.setState({ result: true, showAddForm: false, searchedData: [], searchedDataLoaded: false });
    axios.post(`${apiList.SAVE_USER_API}`, { name, phone, dob })
      .then((response) => {
        this.setState({
          data: [...response.data.data],
          dataLoaded: true,
          pageCount: Math.ceil(response.data.data.length / postPerPage)
        });

        toast.success(response.data.message);
        setTimeout(() => { this.setState({ currentPage: 1, result: false }); }, successTimeOut);
      })
      .catch((error) => {
        toast.error(`${error.response.data.error || error.response.data.message}`);
        setTimeout(() => {
          this.setState({ result: false });
        }, errorTimeOut);
      });
  }

  render() {
    const {
      result,
      showAddForm,
      buttonStatus,

      data,
      dataLoaded,
      searchedData,
      searchedDataLoaded,

      pageCount,
      currentPage,
      postPerPage,

      keyword,
      name,
      phone,
      dob,
    } = this.state;

    const indexOfLastBook = currentPage * postPerPage;
    const indexOfFirstBook = indexOfLastBook - postPerPage;
    pushedData = data.slice(indexOfFirstBook, indexOfLastBook);

    return (
      <div className="data-page">

        {result === true ? <Loading MainProps={this.props} /> : null }

        <ToastContainer />

        <Helmet>
          <style>{'body { background-color: #cccccc; }'}</style>
        </Helmet>

        <div className="container">

          <div className="header-container">
            <h1 className="header">SAVE, READ, SEARCH, UPDATE AND DELETE</h1>
          </div>

          <div className="action-container">

            <div className="search-action">

              <input type="text" placeholder="Search by name" id="keyword" value={keyword} onChange={(id) => this.handleChange(id)} />
              <FontAwesomeIcon icon={faSearch} className="icon" onClick={(key) => { this.handleSearchBook(key); }} />

            </div>

            <div className="reload-action">

              <FontAwesomeIcon icon={faSyncAlt} className="icon" onClick={(key) => { this.componentDidMount(key); }} />

              <FontAwesomeIcon icon={faPlus} className="icon" onClick={(key) => { this.handleShowAddForm(key, 'add'); }} />

            </div>

            <div className="paginate-action">

              {
                currentPage > 1
                  ? (<FontAwesomeIcon icon={faAngleLeft} className="paginate-angles" style={{ color: '#1d7875' }} onClick={(key) => { this.handlePreviouPage(key, currentPage - 1); }} />)
                  : (<FontAwesomeIcon icon={faAngleLeft} className="paginate-angles" style={{ color: '#6d6868' }} />)
              }

              <span className="paginate-page"> {currentPage < 10 ? `0${currentPage}` : currentPage} </span>

              {
                pageCount > currentPage
                  ? (<FontAwesomeIcon icon={faAngleRight} className="paginate-angles" style={{ color: '#1d7875' }} onClick={(key) => { this.handleNextPage(key, currentPage + 1); }} />)
                  : (<FontAwesomeIcon icon={faAngleRight} className="paginate-angles" style={{ color: '#6d6868' }} />)
              }

            </div>

          </div>

          <div className="table-container">

            {dataLoaded === true && data.length > 0 && pushedData.length > 0
              ? (
                <table>

                  <tbody>

                    <tr>
                      <th style={{ width: '50px' }}> ID </th>
                      <th> Name </th>
                      <th> Mobile </th>
                      <th> DOB </th>
                      <th style={{ textAlign: 'center' }}> Action </th>
                    </tr>

                    { searchedDataLoaded === true && searchedData.length > 0
                      ? searchedData.map((element, index) => (
                        <tr key={element.id}>
                          <td>{index + 1}</td>
                          <td> {shortData(element.name)} </td>
                          <td> {element.phone} </td>
                          <td> {element.dob} </td>
                          <td className="table-button">

                            <button type="button" className="update" onClick={(key) => { this.handleShowAddForm(key, 'edit', element.id); }}>
                              <FontAwesomeIcon icon={faPencilAlt} className="icon" />
                            </button>

                            <button type="button" className="delete" onClick={(key) => { this.handleDeleteData(key, element.id); }}>
                              <FontAwesomeIcon icon={faTrashAlt} className="icon" />
                            </button>

                          </td>
                        </tr>

                      ))
                      : pushedData.map((element, index) => (
                        <tr key={element.id}>
                          <td>{index + 1}</td>
                          <td> {shortData(element.name)} </td>
                          <td> {element.phone} </td>
                          <td> {element.dob} </td>
                          <td className="table-button">

                            <button type="button" className="update" onClick={(key) => { this.handleShowAddForm(key, 'edit', element.id); }}>
                              <FontAwesomeIcon icon={faPencilAlt} className="icon" />
                            </button>

                            <button type="button" className="delete" onClick={(key) => { this.handleDeleteData(key, element.id); }}>
                              <FontAwesomeIcon icon={faTrashAlt} className="icon" />
                            </button>

                          </td>
                        </tr>

                      ))}

                  </tbody>

                </table>
              )

              : null}

          </div>

          { showAddForm === true
            ? (
              <div className="form-container">

                <div className="form-header">
                  <h2>USER DETAILS
                    <span onClick={(key) => { this.handleHideAddForm(key); }}>
                      <FontAwesomeIcon icon={faTimes} className="icon" />
                    </span>
                  </h2>
                </div>

                <form className="form">

                  <input type="name" id="name" value={name} placeholder="Name" onChange={(id) => this.handleChange(id)} />
                  <input type="phone" id="phone" value={phone} placeholder="Phone" onChange={(id) => this.handleChange(id)} />
                  <input type="text" id="dob" value={dob} placeholder="Date of birth" onFocus={(e) => { e.target.type = 'date'; }} onChange={(id) => this.handleChange(id)} />

                  {
                    buttonStatus === 'edit'
                      ? <button type="button" onClick={(key) => { this.handleEditData(key); }}> EDIT USER </button>
                      : <button type="button" onClick={(key) => { this.handleSaveData(key); }}> ADD USER </button>
                  }

                </form>

              </div>
            )
            : null}

        </div>

      </div>
    );
  }
}

export default Data;
