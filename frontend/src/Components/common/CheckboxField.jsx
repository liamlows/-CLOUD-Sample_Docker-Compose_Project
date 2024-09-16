export const CheckboxField = ({ label, checked, setChecked }) => {
    return <div className="form-group mb-3">
    <label htmlFor="value">
    <input type="checkbox"
        id="value"
        name="value"
        checked={checked}
        onChange={ event => setChecked(event.target.value) }
        className="me-2" />
        { label }
    </label>
</div>
}