import React from "react";
import { Box, Button, Stack, TextField, Paper, Typography, Divider, Chip } from '@mui/material';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import SendIcon from '@mui/icons-material/Send';

const ReviewForm = ({
  reviewText,
  handleInputChange,
  handleSubmitReview,
  loading,
  rating,
  setRating,
}) => {
  const getRatingText = (rating) => {
    switch (rating) {
      case 1: return "Poor";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Very Good";
      case 5: return "Excellent";
      default: return "Select Rating";
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "#00bfae";
    if (rating >= 3) return "#ff9800";
    return "#f44336";
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <form onSubmit={handleSubmitReview}>
        <Stack spacing={4}>
          {/* Rating Section */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#222' }}>
              How would you rate this product?
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Rating
                name="review-rating"
                value={Number(rating)}
                onChange={(_, value) => setRating(value || 1)}
                size="large"
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: getRatingColor(rating),
                  },
                  '& .MuiRating-iconHover': {
                    color: getRatingColor(rating),
                  },
                }}
              />
              <Chip
                label={getRatingText(rating)}
                sx={{
                  bgcolor: getRatingColor(rating),
                  color: '#fff',
                  fontWeight: 600,
                  px: 2,
                  py: 1,
                  fontSize: '0.9rem'
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ borderColor: '#e0e0e0' }} />

          {/* Review Text Section */}
          <Box>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#222' }}>
              Share your experience
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Tell others what you think about this product. Your review will help other customers make informed decisions.
            </Typography>
            <TextField
              id="review"
              placeholder="Write your review here... Share details about your experience with this product."
              variant="outlined"
              value={reviewText}
              onChange={handleInputChange}
              multiline
              minRows={4}
              maxRows={8}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  fontSize: '1rem',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00bfae',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00bfae',
                    borderWidth: 2,
                  },
                },
                '& .MuiInputBase-input': {
                  padding: '16px',
                  lineHeight: 1.6,
                }
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {reviewText.length}/500 characters
            </Typography>
          </Box>

          {/* Submit Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={!reviewText.trim() || loading || rating === 0}
              startIcon={loading ? null : <SendIcon />}
              sx={{
                bgcolor: '#00bfae',
                color: '#fff',
                fontWeight: 700,
                px: 6,
                py: 2,
                borderRadius: 3,
                fontSize: '1rem',
                textTransform: 'none',
                minWidth: 160,
                height: 56,
                '&:hover': {
                  bgcolor: '#43e6c2',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,191,174,0.3)',
                },
                '&:disabled': {
                  bgcolor: '#e0e0e0',
                  color: '#999',
                  transform: 'none',
                  boxShadow: 'none',
                },
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Submitting Review...' : 'Submit Review'}
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

export default ReviewForm;
