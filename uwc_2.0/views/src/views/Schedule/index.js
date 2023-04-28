import React from 'react';
import { Inject, ScheduleComponent, Day, Week, Month, Agenda } from '@syncfusion/ej2-react-schedule';
import './styles/schedule.css';
import Modal from '../../components/Modal';
import ModalCloseButton from "../../components/ModalCloseButton"

function Schedule({id, onClose}) {

    return (
        <Modal>
            <div className="w-[800px] relative p-4 bg-white">
                <ModalCloseButton
                    onClick={onClose}
                />
                <div className='max-h-[600px] overflow-y-auto'>
                    <ScheduleComponent>
                        <Inject services={[Day, Week, Month, Agenda]}/>
                    </ScheduleComponent>
                </div>
            </div>
        </Modal>
    )
}

export default Schedule;