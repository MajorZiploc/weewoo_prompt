import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  makeStyles,
  Paper,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { AddBoxTwoTone, EditTwoTone, DeleteTwoTone } from '@material-ui/icons';
import { toKeyValArray } from '../utils';
import DataContext from '../context/DataContext';

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectField: {
      margin: theme.spacing(1),
      minWidth: 130,
    },
    textField: {
      minWidth: 130,
      margin: theme.spacing(1),
    },
    button: {
      width: '5%',
      margin: theme.spacing(1),
    },
    table: {
      width: '66%',
      margin: theme.spacing(1),
    },
    tableHeader: {
      display: 'flex',
      width: '98%',
      margin: 'auto',
      justifyContent: 'space-between',
    },
    dialogContent: {
      display: 'flex',
      flexDirection: 'column',
    },
    delete: {
      margin: '0 0 0 35%'
    },
  })
);

const tableSort = (contents, sortColumn, sortDesc) => {
  if (contents.length === 0) return [];
  const key = sortColumn;
  const sortedContents = contents.sort((obj1, obj2) => {
    const a = sortDesc ? obj2 : obj1;
    const b = sortDesc ? obj1 : obj2;
    return Reflect.get(a, sortColumn) ? (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) : -1;
  });
  return typeof contents[0][key] !== 'boolean' ? sortedContents : sortedContents.reverse();
};

// TODO: add delete functionality
const GenericCrudTable = ({
  modelName,
  defaultModel,
  modelId = 'id',
  modelFields,
  modelData,
  validatedModel,
  tableId,
}) => {
  const classes = useStyles();
  const [showModal, setShowModal] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [sortColumn, setSortColumn] = React.useState('title');
  const [sortDesc, setSortDesc] = React.useState(false);
  const [alertSettings, setAlertSettings] = React.useState({
    display: false,
    message: '',
    severity: 'error',
  });
  const [editMode, setEditMode] = React.useState(false);
  const [myListMode, setMyListMode] = React.useState(false);
  const componentMounted = React.useRef(true);
  const [models, setModels] = React.useState([]);
  const [enteredModel, setEnteredModel] = React.useState(defaultModel);
  const [searchTerm, setSearchTerm] = React.useState('');
  const data = React.useContext(DataContext);

  let modelCount = 0;

  React.useEffect(() => {
    return () => {
      componentMounted.current = false;
    };
  }, []);

  React.useEffect(() => {
    (async () => {
      await UpdateModels();
    })();
  }, []);

  const UpdateModels = async () => {
    const modelsResult = await modelData.getModels().catch(_e => {
      openAlert({ display: true, message: 'Listed models failed to load', severity: 'error' });
      return [];
    });
    if (componentMounted.current) {
      setModels(modelsResult);
    }
  };

  const DeleteModel = async () => {
    await modelData.deleteModel(enteredModel[modelId]).catch(_e => {
      openAlert({ display: true, message: 'Failed to delete model', severity: 'error'});
    })
    UpdateModels();
    closeModal();
  }

  const openAlert = alertSettings => {
    if (componentMounted.current) {
      setAlertSettings(alertSettings);
    }
  };

  const closeAlert = () => {
    setAlertSettings({ display: false, message: alertSettings?.message, severity: alertSettings?.severity });
  };

  const handleChangePage = (_e, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = e => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(0);
  };

  async function openModal(Model = defaultModel) {
    setEnteredModel(Model);
    setShowModal(true);
  }

  const closeModal = () => {
    if (componentMounted.current) {
      setShowModal(false);
    }
  };

  const handlePostOrPutModel = async () => {
    handleModelAction(model =>
      model[modelId] === 0 ? modelData.postModel(model) : modelData.putModel(model[modelId], model)
    );
  };

  const handleModelAction = async (action, alertMsgLabel = undefined) => {
    if (!enteredModel) {
      openAlert({ display: true, message: 'No model found', severity: 'error' });
      closeModal();
      return;
    }
    const { isValid, errorMessage } = validatedModel(enteredModel);
    if (!isValid) {
      openAlert({ display: true, message: errorMessage, severity: 'error' });
      return;
    }

    await action(enteredModel)
      .then(_e =>
        openAlert({
          display: true,
          message: `Successfully ${alertMsgLabel ?? (enteredModel[modelId] === 0 ? 'adde' : 'update')}d title ${
            enteredModel.title
          }`,
          severity: 'success',
        })
      )
      .catch(_e =>
        openAlert({
          display: true,
          message: `Failed to ${alertMsgLabel ?? (enteredModel[modelId] === 0 ? 'add' : 'update')} title ${
            enteredModel.title
          }`,
          severity: 'error',
        })
      );
    UpdateModels();
    closeModal();
  };

  const handleSearch = () => {
    var filtered = models.filter(item => searchTerm !== '' ? toKeyValArray(item).some(kv => (kv.value + '').toLowerCase().includes(searchTerm)) : true);
    filtered = filtered.filter(item => myListMode ? toKeyValArray(item).some(kv => kv.key === 'creator' && kv.value === data.getUserName()) : true);
    modelCount = filtered.length;
    return filtered;
  };

  const setSortParams = column => {
    if (column === sortColumn) {
      setSortDesc(!sortDesc);
    } else {
      setSortColumn(column);
      setSortDesc(false);
    }
    setCurrentPage(0);
  };

  const toProperCase = str => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  return (
    <div>
      <Snackbar
        id='modelsPageAlertSnackbar'
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={alertSettings?.display}
        autoHideDuration={6000}
        onClose={closeAlert}
      >
        <Alert onClose={closeAlert} severity={alertSettings?.severity}>
          {alertSettings?.message}
        </Alert>
      </Snackbar>

      <Dialog onClose={closeModal} aria-labelledby='customized-dialog-title' open={showModal}>
        <DialogTitle id='customized-dialog-title'>
          {enteredModel && enteredModel[modelId] !== 0 ? 'Edit' : 'Add'} {modelName}:
          <Tooltip title='Delete Model'>
            <IconButton className={classes.delete} onClick={async () => await DeleteModel()}>
              <DeleteTwoTone color='secondary' />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent dividers className={classes.dialogContent}>
          {modelFields.map((mf, i) => {
            const key = mf;
            const label = toProperCase(mf);
            return (
              <TextField
                key={i}
                className={classes.textField}
                label={label}
                variant='outlined'
                size='small'
                value={enteredModel && enteredModel[mf]}
                onChange={e => {
                  const newField = {};
                  newField[`${key}`] = e.target.value;
                  setEnteredModel({ ...enteredModel, ...newField });
                }}
              />
            );
          })}
        </DialogContent>
        <DialogActions style={{ justifyContent: 'space-evenly' }}>
          <Button onClick={closeModal} color='default'>
            Cancel
          </Button>
          <Button autoFocus onClick={async () => await handlePostOrPutModel()} color='primary'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <div className={classes.container}>
        <Paper id={tableId} className={classes.table}>
          <div className={classes.tableHeader}>
            <FormControlLabel
              value='start'
              control={<Switch color='primary' />}
              label='Edit'
              labelPlacement='start'
              checked={editMode}
              onChange={_e => {
                const newEditMode = !editMode;
                setEditMode(newEditMode);
              }}
            />
            <FormControlLabel
              value='start'
              control={<Switch color='primary' />}
              label='My List'
              labelPlacement='start'
              checked={myListMode}
              onChange={_e => {
                const newMyListMode = !myListMode;
                setMyListMode(newMyListMode);
              }}
            />
            {editMode && (
              <div>
                <FormControl variant='outlined' className={classes.selectField} size='small'></FormControl>
                <Tooltip title={`Add ${modelName}`}>
                  <IconButton onClick={async () => await openModal()}>
                    <AddBoxTwoTone color='primary' fontSize='large' />
                  </IconButton>
                </Tooltip>
              </div>
            )}
            <div>
              <TextField
                className={classes.textField}
                label='Search...'
                variant='outlined'
                size='small'
                onChange={e => {
                  setSearchTerm(e.target.value ? e.target.value.toLowerCase() : '');
                  setCurrentPage(0);
                }}
              />
            </div>
          </div>

          <TableContainer>
            <Table aria-labelledby='tableTitle' size='small' aria-label='enhanced table'>
              <TableHead>
                <TableRow>
                  {modelFields.map(mf => (
                    <TableCell>
                      <TableSortLabel
                        active={sortColumn === mf}
                        direction={sortDesc ? 'desc' : 'asc'}
                        onClick={() => setSortParams(mf)}
                      >
                        {toProperCase(mf)}
                      </TableSortLabel>
                    </TableCell>
                  ))}

                  {editMode && (
                    <>
                      <TableCell>Actions</TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableSort(handleSearch(), sortColumn, sortDesc)
                  .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
                  .map(row => {
                    return (
                      <TableRow hover key={row[modelId]}>
                        {modelFields.map((mf, i) => (
                          <TableCell key={i} component='th' scope='row'>
                            {row[mf]}
                          </TableCell>
                        ))}
                        {editMode && (
                          <>
                            <TableCell>
                              <Tooltip title='Edit Model'>
                                <IconButton onClick={async () => await openModal(row)}>
                                  <EditTwoTone color='secondary' />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[25, 50, 100]}
            component='div'
            count={modelCount}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </div>
  );
};
export default GenericCrudTable;
