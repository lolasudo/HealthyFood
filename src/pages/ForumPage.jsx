import React, { useState } from 'react';
import { Container, Typography, Button, TextField, Card, CardContent, List, ListItem, ListItemText, Divider, Box } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import './ForumPage.css';

const ForumPage = () => {
  const [topics, setTopics] = useState([
    { category: 'Обсуждения', threads: ['Польза овощей', 'Как выбрать полезные продукты'] },
    { category: 'Советы', threads: ['Как избежать вредных добавок', 'Здоровое питание вне дома'] },
  ]);
  const [newTopic, setNewTopic] = useState('');

  const addTopic = () => {
    if (newTopic.trim()) {
      setTopics([...topics, { category: newTopic, threads: [] }]);
      setNewTopic('');
    }
  };

  return (
    <Container maxWidth="lg" className="forum-container">
      <Typography variant="h4" className="forum-title">Форум</Typography>
      <Box className="forum-header">
        <TextField
          label="Новая тема"
          variant="outlined"
          size="small"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={addTopic}>
          Добавить тему
        </Button>
      </Box>
      <List className="forum-list">
        {topics.map((topic, index) => (
          <Card key={index} className="forum-card">
            <CardContent>
              <Typography variant="h6" className="forum-category">{topic.category}</Typography>
              <List>
                {topic.threads.map((thread, idx) => (
                  <ListItem key={idx} button className="forum-thread">
                    <ListItemText primary={thread} />
                    <Box className="forum-thread-info">
                      <ChatBubbleOutlineIcon className="reply-icon" />
                      <Typography variant="body2">0</Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        ))}
      </List>
    </Container>
  );
};

export default ForumPage;