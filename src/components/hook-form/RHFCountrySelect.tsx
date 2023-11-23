import { countries } from 'src/assets/data';
import CountryFlag from 'src/components/country-flag';
import RHFAutocomplete from 'src/components/hook-form/RHFAutocomplete';

const RHFCountrySelect = (props) => {
    return (
        <RHFAutocomplete
            {...props}
            options={countries}
            valueKey="code"
            startIcon={(option) => option?.code && <CountryFlag code={option.code} />}
        />
    )
}

export default RHFCountrySelect