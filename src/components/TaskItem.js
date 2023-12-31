import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state/index';

const TaskItem = (props) => {
    const calculateDaysRemaining = (deadline, currentDate) => {
        if (deadline === null) {
            return null;
        }

        // Convert deadline and current date to their respective UTC values
        const deadlineUTC = Date.UTC(
            deadline.getFullYear(),
            deadline.getMonth(),
            deadline.getDate()
        );
        const currentDateUTC = Date.UTC(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate()
        );

        // Calculate the difference in days
        const daysDifference = Math.floor(
            (deadlineUTC - currentDateUTC) / (1000 * 60 * 60 * 24)
        );

        return daysDifference;
    }

    const dispatch = useDispatch();
    const { deleteTask } = bindActionCreators(actionCreators, dispatch)
    const { task, updateTask, mode } = props;
    let deadline = null;

    let formattedDeadline = "";
    if (task.deadline != null) {

        deadline = new Date(task.deadline);

        const yyyy = deadline.getFullYear();
        let mm = deadline.getMonth() + 1; // Months start at 0!
        let dd = deadline.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        formattedDeadline = dd + '/' + mm + '/' + yyyy;
    }

    const current_date = new Date();
    const creation_date = new Date(task.date);
    const daysRemaining = calculateDaysRemaining(deadline, current_date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = creation_date.toLocaleDateString('en-US', options);


    return (
        <div>
            <div className={`card d-flex justify-content-center p-3 my-3 bg-${mode === 'light' ? 'light' : 'dark'} border-dark `} >
                <div id="utility-div">
                    <div>
                        {dateString}
                    </div>
                    <div>
                        <i className="fa-sharp fa-solid fa-trash mx-2" onClick={() => { deleteTask(task._id); props.showAlert("Task Deleted Succesfully", "success"); }}></i>
                        <i className="fa-solid fa-pen-to-square mx-2" onClick={() => { updateTask(task) }}></i>
                    </div>
                </div>
                <hr />
                <div className=" d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className={`card-title fw-semibold `}> {task.title}</h5>
                        <p className="card-text"> <span id='description'>{task.description} </span> </p>
                        {
                            task.deadline != null &&
                            <div id='deadline'>
                                {/* <p>Deadline: {dateString}</p> */}
                                {daysRemaining > 0 ? <span> Days Remaining: <span className='text-success'> {daysRemaining} </span></span>
                                    : <span>Deadline expired: <span className='text-danger'>{daysRemaining * -1} days ago </span> <span id='deadlinedate'>({`${formattedDeadline}`}) </span></span>}
                            </div>
                        }
                    </div>

                </div>
            </div>
        </div >
    )
}

export default TaskItem
