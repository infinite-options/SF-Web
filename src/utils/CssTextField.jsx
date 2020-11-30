import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/styles/withStyles';
import appColors from '../styles/AppColors';

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: appColors.secondary,
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: appColors.secondary,
      },
    },
  },
})(TextField);

export default CssTextField;
