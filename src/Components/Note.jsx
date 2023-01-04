import axios from 'axios';
import jwt_decode from 'jwt-decode';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { NavLink } from 'react-router-dom'
import Swal from 'sweetalert2'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Note() {
  const [note, setNote] = useState({ title: '', desc: '' });
  const [allNotes, setAllNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('')

  let decoded = jwt_decode(localStorage.getItem('userToken'));


  function noteValue(e) {
    let myNote = { ...note };
    myNote[e.target.name] = e.target.value;
    setNote(myNote)
  };

  async function getAllNote() {
    setLoading(true)
    const { data } = await axios.get(`https://route-movies-api.vercel.app/getUserNotes`, {
      headers: {
        Token: localStorage.getItem('userToken'),
        userID: decoded._id,
      }
    });
    if (data.message === 'success') {
      setAllNotes(data.Notes)
    }
    setLoading(false)
  };
  useEffect(() => {
    getAllNote()
  }, []);

  async function addNewNote(e) {
    e.preventDefault();
    let { data } = await axios.post(`https://route-movies-api.vercel.app/addNote`, {
      title: note.title,
      desc: note.desc,
      userID: decoded._id,
      token: localStorage.getItem('userToken')
    });
    if (data.message === 'success') {
      Swal.fire('Added', ' ', 'success').then(() => {
        getAllNote()
      })
    }
  }


  async function deleteNote(id) {
    Swal.fire({
      text: 'Are You Sure you want to delete this note ?',
      icon: 'warning',
      showCancelButton: true
    }).then(async (res) => {
      if (res.isConfirmed === true) {
        let { data } = await axios.delete(`https://route-movies-api.vercel.app/deleteNote`, {
          data: {
            NoteID: id,
            token: localStorage.getItem('userToken')
          }
        });
        if (data.message === 'deleted') {
          getAllNote()
        }
      }
    }).catch(() => {
      Swal.fire({
        text: 'Error',
        icon: 'error',
        showCloseButton: true
      })
    })
  };


  async function updateNote(e) {
    e.preventDefault()
    let { data } = await axios.put(`https://route-movies-api.vercel.app/updateNote`, {
      ...note,
      token: localStorage.getItem('userToken'),
      userID: decoded._id
    });
    if (data.message === 'updated') {
      Swal.fire('updated', ' ', 'success').then(() => {
        getAllNote()
      })
    }
  }


  function editNote(index) {
    console.log(allNotes[index]);
    document.querySelector("#updateModal input").value = allNotes[index].title;
    document.querySelector("#updateModal textarea").value = allNotes[index].desc;
    setNote({ ...note, "title": allNotes[index].title, "desc": allNotes[index].desc, "NoteID": allNotes[index]._id })
  }


  function searchNote(e) {
    let text = e.target.value;
    setQuery(text);
    if (text.length > 0) {
      let data = allNotes.filter((dta) => dta.title.toLowerCase().includes(text.toLowerCase()));
      setAllNotes(data)
    } else {
      getAllNote()
    }
  }



  return (
    <>
      <button className='btn btn-info text-end float-end my-3' data-bs-toggle="modal" data-bs-target="#exampleModal">
        Add a Note
      </button>
      <div className="clearfix"></div>
      {/* add notes */}
      <div className="modal text-dark" tabIndex="-1" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <form onSubmit={addNewNote}>
          <div className="modal-dialog">

            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Note</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body ">
                <input type="text" onChange={noteValue} className='form-control mb-2 text-dark' placeholder='title' name='title' />
                <textarea name="desc" onChange={noteValue} className='form-control' cols="30" placeholder='description' rows="10"></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary">Add Note</button>
              </div>
            </div>

          </div>
        </form>
      </div>
      {/* ---------------------- */}

      <div className="modal text-dark" tabIndex="-1" id="updateModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <form onSubmit={updateNote}>
          <div className="modal-dialog">

            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add update Note</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body ">
                <input type="text" onChange={noteValue} className='form-control mb-2 text-dark' placeholder='title' name='title' />
                <textarea name="desc" onChange={noteValue} className='form-control' cols="30" placeholder='description' rows="10"></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary">Update Note</button>
              </div>
            </div>

          </div>
        </form>
      </div>

      {/* ---------------------- */}

      {loading ? <Skeleton style={{ margin: '30px 10px' }} highlightColor="#202020" baseColor='rgba(255,255,255,.3)' count={4} inline={true} height={150} width={250} /> : <>
        <div className="row">
          <div>
            <input type="text" value={query} onChange={searchNote} className='form-control mt-3 bg-transparent text-white' placeholder='Search...' />
          </div>

          {allNotes && allNotes.map((note, index) => (
            <div key={note._id} className="col-md-3">
              <div className="note">

                <h3 className='float-start'>{note.title}</h3>
                <div className="icon float-end py-2">
                  <NavLink><i onClick={() => deleteNote(note._id)} className="fa-solid fa-trash text-white"></i></NavLink>
                  <NavLink><i onClick={() => editNote(index)} className="fa-solid fa-pen-to-square text-white ms-3" data-bs-toggle="modal" data-bs-target="#updateModal"></i></NavLink>
                </div>
                <div className="clearfix"></div>
                <p>{note.desc}</p>
              </div>
            </div>
          ))}




        </div> </>}

        {allNotes.length === 0 && loading ===false ? <div className='text-center my-5 fw-bold'>No Notes found !</div> :''}


    </>
  )
}
