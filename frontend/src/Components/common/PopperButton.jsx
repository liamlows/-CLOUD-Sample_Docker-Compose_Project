export const PopperButton = ({buttonText, content}) => {
    return <div>
    <button aria-describedby={buttonText} type="button" onClick={handleClick}>
        {buttonText}
    </button>
    <Popper id={id} open={open} anchorEl={anchorEl}>
    <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
        {content}
    </Box>
    </Popper>
</div>
}