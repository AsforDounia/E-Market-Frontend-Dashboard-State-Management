import React, { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import useCreateReview from "../hooks/useCreateReview";
import { FaStar } from "react-icons/fa";

const ReviewForm = ({ productId, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const { mutate: createReview, isPending } = useCreateReview();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (rating === 0) {
            return;
        }

        createReview(
            { productId, rating, comment },
            {
                onSuccess: () => {
                    setRating(0);
                    setComment("");
                    if (onSuccess) onSuccess();
                },
            }
        );
    };

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Laisser un avis</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label className="block mb-2 text-sm font-medium">Note *</Label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <FaStar
                                        size={32}
                                        className={
                                            star <= (hover || rating)
                                                ? "text-yellow-400"
                                                : "text-gray-300"
                                        }
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="text-sm text-gray-600 mt-2">
                                {rating === 1 && "Très mauvais"}
                                {rating === 2 && "Mauvais"}
                                {rating === 3 && "Moyen"}
                                {rating === 4 && "Bon"}
                                {rating === 5 && "Excellent"}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="comment" className="block mb-2 text-sm font-medium">
                            Commentaire
                        </Label>
                        <Textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Partagez votre expérience avec ce produit..."
                            rows={4}
                            className="w-full resize-none"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending || rating === 0}
                        className="w-full"
                    >
                        {isPending ? "Envoi en cours..." : "Publier l'avis"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default ReviewForm;
