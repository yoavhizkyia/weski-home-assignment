import { resorts } from '../../../utils/resorts';
import Select from '../../select/select';

interface Props {
    onChange: (resortId: number) => void;
    value: number;
}

const ResortsSelect: React.FC<Props> = ({onChange, value}) => {
    return (
        <Select
            onChange={resortId => onChange(Number(resortId))} 
            value={value.toString()} 
            options={resorts.map(resort => ({label: resort.name, value: resort.id.toString()}))} 
        />
    )
}

export default ResortsSelect;