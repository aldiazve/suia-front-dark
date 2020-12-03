import React, { useContext } from 'react'
import SectionContainer from '../components/section-container'
import Dropdown from './../components/drop-down'
import Button from './../components/button'
import Input from './../components/input'
import * as awsHelper from './../utilities/aws-helper'
import { parseShedule } from '../utilities/date-helper';
import styled from 'styled-components'
import { UserContext } from '../providers/user-provider'

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const CourseInfo = styled.div`
  width: 100%;
  height: 100%;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  padding-left: 0;
`
const CourseCard = styled.div`
  flex: 0 0 30%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-right: 20px;
  margin-bottom: 10px;
  background-color: ${(props) => props.theme.colors.gray[4]};
  padding: 20px;
  height: 290px;
  border-radius: 20px;
  h3 {
    margin: 0;
    color: ${(props) => props.theme.colors.secondary};
    font-weight: 600;
  }
`

const CourseCardFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  .groups {
    flex: 0 0 100%;
  }
  .students, .code {
    flex: 0 0 50%;
  }
  p {
    margin-top: 5px;
    margin-bottom: 0;
  }
`

const CoursesContainer = styled.div`
  margin-top: 20px;
  height: calc(100% - 80px);
  width: 100%;
  padding-top: 10px;
  margin-bottom: ${(props) => props.marginBottom};
`
const Div = styled.div`
  display: flex;
  flex-direction: column;
  width:100%;
  margin-bottom: ${(props) => props.marginBottom};
  margin-top: ${(props) => props.marginBottom};
  border-bottom-style: dashed;
  border-bottom-width: 1px;
  border-bottom-color: gray;
`

const DivSchedule = styled.div`
  display: flex;
  flex-direction: column;
  width:100%;
  font-size: 80%;
  color: grey;
  margin-top: ${(props) => props.marginTop};
  margin-bottom: ${(props) => props.marginBottom};
`

const Div2 = styled.div`
  display: flex;
  flex-direction: row;
  width:35%;
  justify-content: space-between;
  margin-left:15px;
`
const Text = styled.p`
  font-size: ${(props) => props.size};
  margin-left: 15px;
  color: ${(props) => props.color};
`
const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const Overbook = (props) => {

  const [courses, setCourses] = React.useState([])
  const [courseCode, setCourseCode] = React.useState(null)
  const user = useContext(UserContext)

  const classes = useStyles();


  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };



  const getCoursesByCode = async () => {

    setCourses(await awsHelper.getCourseByCode(courseCode))
  }


  // genera la peticion de sobrecupo
  // faltaria poner el requester id (primer parametro de la funcion)
  const onClickOverbook = async (courseId, courseName) => {
    const body = {
      "requester_id": user.userData.id,
      "courseID": courseId,
      "courseName": courseName,
      "type": "sobrecupo",
      "state": "sin_revisar"
    }
    await awsHelper.putRequest(body)
    handleOpen()
  }

  const onClickSearch = async () => {
    getCoursesByCode()
  }

  return (
    <SectionContainer>
      <h1>Sobrecupo</h1>

      <div>
        <Text 
        size ="19px"
        color = "#565A5C">Ingrese el código de la matería</Text>
      </div>
      <Div2>
        <Input
          marginTop="20px"
          height="35px"
          value={courseCode} onChange={e => setCourseCode(e.target.value)}>
        </Input>
        <Button
          marginTop="20px"
          type='submit' withIcon solid onClick={onClickSearch}>
          <i className="material-icons-round">search</i>
                    Buscar grupo
        </Button>
      </Div2>
      <CoursesContainer>
        <CourseInfo>
          {
            courses.map(
              (course) => (
                <CourseCard>
                  <h3>{course["name"]}</h3>
                  <CourseCardFooter>
                    <Div marginBottom ="20px">
                    <p className="classroom">{course["classroom"]}</p>
                    </Div>

                    <Div>
                      {parseShedule(course.schedule).map((schedule) => (
                        <p className={schedule.day}>{schedule.day} {schedule.hours}</p>
                          )
                        )
                      }
                    </Div>
                    <DivSchedule 
                    marginBottom = "10px"
                    marginTop="15px">
                      <li type="square">Elección Libre - {course.capacityDistribution.freeElection}</li>
                      <li type="square">Fundamentación - {course.capacityDistribution.fundamentation}</li>
                      <li type="square"> Obligatoria Opcional - {course.capacityDistribution.disciplinaryOptional}</li>
                      <li type="square"> Obligatoria Obligatoria - {course.capacityDistribution.disciplinaryObligatory}</li>
                    </DivSchedule>
                  </CourseCardFooter>
                  <Button solid onClick={e => onClickOverbook(course.id, course.name)}>Solicitar sobrecupo</Button>
                  <Modal
                    aria-labelledby="Petición de sobrecupo!"
                    aria-describedby="La petición ya está en la cola"
                    className={classes.modal}
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout:4,
                    }}
                  >
                    <Fade in={open}>
                      <div className={classes.paper}>
                        <h1 id="transition-modal-title">Petición exitosa!</h1>
                        <p id="transition-modal-description">espere una respuesta por parte de su coordinador.</p>
                      </div>
                    </Fade>
                  </Modal>
                </CourseCard>
              )

            )

          }
        </CourseInfo>
      </CoursesContainer>

    </SectionContainer >
  )
}

export default Overbook
