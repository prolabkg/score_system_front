import React, { useContext, useState } from 'react'
import { OutlinedInput } from '../ui/Inputs'
import { AccentLoaderButton } from '../ui/Buttons'
import usePatchData from '../../hooks/usePatchData'
import { useDispatch, useSelector } from 'react-redux'
import { SetStaffContext } from '../../context'
import { refreshProfile } from '../../redux/auth/authSlice'

const UpdatePoint = ({options, setOpen}) => {

    const [value, setValue] = useState(options?.value ?? 0)
    const [note, setNote] = useState(options?.note ?? '')

    const {staffs, setStaff} = useContext(SetStaffContext)

    const auth  = useSelector(state => state.auth)

    const {patchData, errors, isFetching} = usePatchData({
        url: `/api/v1/points/${options.pointId}/`,
        headers: {
            'Authorization': `Token ${auth.user.token}`
        }
    })

    const dispatch = useDispatch()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const uploadData = {
            value,
            note
        }
        const response = await patchData(uploadData);
 
        if (!!response) {
            if(options.many) {
                const changedStaffs = staffs.map((item) => {
                    if(item.id === options.staffId) item.point_as_staff = response
                    return item
                })
                setStaff([...changedStaffs]) 
            }
            else {
                setStaff({...staffs, point_as_staff: response}) 
            }
            setOpen(false)
        }
    }


    return (
        <form onSubmit={e => handleSubmit(e)}>
            <div className="flex gap-3 ">
                <div className="grow">
                    <OutlinedInput
                        type="number"
                        placeholder="Балл"
                        containerClass='mb-3'
                        onChange={e => setValue(e.target.value)}
                        value={value}
                        errors={errors?.value || []}
                        min="0"
                    />
                    <OutlinedInput
                        type="text"
                        placeholder="Заметка"
                        onChange={e => setNote(e.target.value)}
                        value={note}
                        errors={errors?.note || []}
                        min="0"
                    />
                </div>
                <AccentLoaderButton isLoading={isFetching} className='sm'>
                    <i className='bx bx-check'></i>
                </AccentLoaderButton>
            </div>
        </form>
    )
}

export default UpdatePoint