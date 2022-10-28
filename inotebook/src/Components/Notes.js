import React, { useContext , useEffect} from 'react'
import NoteContext from "../Context/notes/noteContext"
import NoteItem from './NoteItem';
import AddNote from './AddNote';

const Notes = () => {
    const context = useContext(NoteContext);
    const {notes, getNotes} = context;
    useEffect(() => {
        getNotes()
    }, [])
    return (
        <>
            <AddNote />
            <div className="row my-3">
                <h2>You Notes</h2>
                {notes.map((note) => {
                    return <NoteItem key={note._id} note={note} />
                })}
            </div>
        </>
    )
}

export default Notes

