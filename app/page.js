"use client";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Button,
  Modal,
  Select,
  Stack,
  TextField,
  Typography,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { styled } from "@mui/material/styles";
import theme from "./theme";

// Inventory box styles
const InventoryBox = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "10px",
  boxShadow: theme.shadows[3],
  width: "800px",
  margin: theme.spacing(2, 0),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));


// Inventory item styles
const InventoryItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(2),
  margin: theme.spacing(1, 0),
  borderRadius: "5px",
  transition: "background-color 0.3s",
  position: "relative",
  "&:hover": {
    backgroundColor: theme.palette.grey[300],
  },
  "& .item-buttons": {
    display: "none",
    position: "absolute",
    right: 10,
  },
  "&:hover .item-buttons": {
    display: "flex",
  },
}));

const TruncatedText = styled(Typography)({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "150px",
});

// Circular button styles
const CircularButton = styled(Button)(({ theme }) => ({
  borderRadius: "50%",
  minWidth: "40px",
  width: "40px",
  height: "40px",
  padding: "0",
}));

// Landing slider page styles
const SliderPage = styled(Box)(({ theme, open }) => ({
  position: "absolute",
  top: open ? 0 : "100vh",
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "#f5e0e0",
  transition: "top 0.5s ease",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemCategory, setItemCategory] = useState("");
  const [modalType, setModalType] = useState("new");
  const [filterInput, setFilterInput] = useState("");
  const [promptOpen, setPromptOpen] = useState(false);
  const [promptItem, setPromptItem] = useState({
    name: "",
    category: "",
    quantity: 1,
  });
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];

    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    filterInventory(filterInput, inventoryList);
  };

  const filterInventory = (input, inventoryList) => {
    const filteredList = inventoryList.filter(
      (item) =>
        item.name.toLowerCase().includes(input.toLowerCase()) ||
        item.category.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredInventory(filteredList);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterInput(value);
    filterInventory(value, inventory);
  };

  const removeItem = async (item, quantityToRemove = 1) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity, category } = docSnap.data();
      if (quantity <= quantityToRemove) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          category,
          quantity: quantity - quantityToRemove,
        });
      }
    }
    await updateInventory();
  };

  const addItem = async (item, category, quantity = 1) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity: existingQuantity, category: existingCategory } =
        docSnap.data();
      await setDoc(docRef, {
        category: existingCategory,
        quantity: existingQuantity + quantity,
      });
    } else {
      await setDoc(docRef, { category, quantity });
    }
    await updateInventory();
  };

  const resetInventory = async () => {
    const batch = writeBatch(firestore);
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);

    docs.forEach((doc) => {
      const docRef = doc.ref;
      batch.delete(docRef);
    });

    await batch.commit();
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    filterInventory(filterInput, inventory);
  }, [inventory, filterInput]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setItemName("");
    setItemQuantity(1);
    setItemCategory("");
    setModalType("new");
  };

  const handlePromptClose = () => {
    setPromptOpen(false);
    setPromptItem({ name: "", category: "", quantity: 1 });
  };

  const handlePromptConfirm = async () => {
    await addItem(promptItem.name, promptItem.category, promptItem.quantity);
    handlePromptClose();
  };

  const handleResetConfirmOpen = () => setResetConfirmOpen(true);
  const handleResetConfirmClose = () => setResetConfirmOpen(false);
  const handleResetConfirm = async () => {
    await resetInventory();
    handleResetConfirmClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted. Action:", modalType);

    if (modalType === "new") {
      await addItem(itemName, itemCategory, itemQuantity);
    } else if (modalType === "update") {
      const docRef = doc(collection(firestore, "inventory"), itemName);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity: existingQuantity, category: existingCategory } =
          docSnap.data();
        await setDoc(docRef, {
          category: existingCategory,
          quantity: existingQuantity + itemQuantity,
        });
        await updateInventory();
      } else {
        setPromptItem({
          name: itemName,
          category: itemCategory,
          quantity: itemQuantity,
        });
        setPromptOpen(true);
      }
    } else if (modalType === "delete") {
      await removeItem(itemName, itemQuantity);
    }
    handleClose();
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
        bgcolor="#f0f4f8"
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          {/* Inventory Title */}
          <Typography variant="h3" sx={{ padding: '16px' }}>
            Pantry Tracker System
          </Typography>

          {/* Manage and Reset Buttons */}
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={handleOpen}>
              Manage Inventory
            </Button>
            <Button variant="outlined" onClick={handleResetConfirmOpen}>
              Reset Inventory
            </Button>
          </Stack>
        </Box>

        {/* Inventory List */}
        <InventoryBox>
          {/* Filter Section */}
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Filter"
              variant="outlined"
              value={filterInput}
              onChange={handleFilterChange}
            />
          </Stack>
          {filteredInventory.map((item, index) => (
            <InventoryItem key={index}>
              <TruncatedText>{item.name}</TruncatedText>
              <Typography>{item.quantity}</Typography>
              <Typography>{item.category}</Typography>
              <Box className="item-buttons" display="flex" gap={1}>
                <CircularButton
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setItemName(item.name);
                    setItemQuantity(1);
                    setModalType("update");
                    handleOpen();
                  }}
                >
                  +
                </CircularButton>
                <CircularButton
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setItemName(item.name);
                    setItemQuantity(1);
                    setModalType("delete");
                    handleOpen();
                  }}
                >
                  -
                </CircularButton>
              </Box>
            </InventoryItem>
          ))}
        </InventoryBox>
      </Box>

      {/* Inventory Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 4,
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 24,
            width: 400,
            mx: "auto",
            mt: 10,
          }}
        >
          <Typography variant="h6">
            {modalType === "new" ? "Add Item" : "Update/Delete Item"}
          </Typography>
          <TextField
            label="Item Name"
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
          {modalType === "new" && (
            <TextField
              label="Category"
              variant="outlined"
              fullWidth
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value)}
              required
            />
          )}
          <TextField
            label="Quantity"
            type="number"
            variant="outlined"
            fullWidth
            value={itemQuantity}
            onChange={(e) => setItemQuantity(parseInt(e.target.value))}
            required
          />
          <Button type="submit" variant="contained">
            {modalType === "new"
              ? "Add Item"
              : modalType === "update"
              ? "Update Item"
              : "Delete Item"}
          </Button>
        </Box>
      </Modal>

      {/* Prompt Dialog */}
      <Dialog open={promptOpen} onClose={handlePromptClose}>
        <DialogTitle>Item Not Found</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The item &quot;{promptItem.name}&quot; does not exist in the
            inventory. Would you like to add it as a new item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePromptClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePromptConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Confirm Dialog */}
      <Dialog open={resetConfirmOpen} onClose={handleResetConfirmClose}>
        <DialogTitle>Reset Inventory</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reset the inventory? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetConfirmClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleResetConfirm} color="primary">
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
